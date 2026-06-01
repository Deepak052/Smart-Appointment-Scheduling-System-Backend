const AppointmentSlot = require('../models/AppointmentSlot');

const getAvailableSlots = async (date) => {
    console.log("Fetching available slots for date:", date); 
    let query = { status: 'AVAILABLE' };
    if (date) {
        query.date = date;
    }
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    let slots = await AppointmentSlot.find(query).sort({ date: 1, startTime: 1 });
    
    
    if (date && slots.length === 0 && date >= today) {
        console.log(`No slots found for ${date}, generating and storing in DB...`);
        const newSlots = [];
        for (let hour = 9; hour < 17; hour++) {
            const startTime = hour.toString().padStart(2, '0') + ':00';
            const endTime = (hour + 1).toString().padStart(2, '0') + ':00';
            newSlots.push({
                date: date,
                startTime,
                endTime,
                status: 'AVAILABLE'
            });
        }
        try {
            await AppointmentSlot.insertMany(newSlots, { ordered: false });
            slots = await AppointmentSlot.find(query).sort({ date: 1, startTime: 1 });
            console.log(`Successfully stored ${slots.length} slots for ${date} in DB`);
        } catch (e) {
            console.error("Error generating slots:", e.message);
        }
    }

    return slots.filter(slot => {
        if (slot.date < today) return false;
        if (slot.date === today) {
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            if (slot.startTime <= currentTime) return false;
        }
        return true;
    });
};

const getUserAppointments = async (userId) => {
    return await AppointmentSlot.find({ bookedBy: userId }).sort({ date: 1, startTime: 1 });
};

const bookAppointment = async (userId, slotId) => {

    const slot = await AppointmentSlot.findById(slotId);
    
    if (!slot) {
        throw new Error('Slot not found');
    }

    if (slot.status !== 'AVAILABLE') {
        throw new Error('slot is already booked');
    }

   
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (slot.date < today || (slot.date === today && slot.startTime <= (now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')))) {
        throw new Error('Cannot book past slots');
    }

    
    const existingBooking = await AppointmentSlot.findOne({
        date: slot.date,
        bookedBy: userId
    });

    if (existingBooking) {
        throw new Error('you can book one appointment per day');
    }

    
    const updatedSlot = await AppointmentSlot.findOneAndUpdate(
        { _id: slotId, status: 'AVAILABLE' },
        { status: 'BOOKED', bookedBy: userId },
        { new: true }
    );

    if (!updatedSlot) {
        throw new Error('Slot was booked by someone else just now');
    }

    return updatedSlot;
};

const cancelAppointment = async (userId, slotId) => {
    const slot = await AppointmentSlot.findById(slotId);

    if (!slot) {
        throw new Error('Appointment not found');
    }

    if (slot.bookedBy.toString() !== userId.toString()) {
        throw new Error('not autherized to cancel this assignment');
    }

    
    const slotDateTime = new Date(`${slot.date}T${slot.startTime}:00Z`);
    const now = new Date();
    const diffHours = (slotDateTime - now) / (1000 * 60 * 60);

    if (diffHours < 24) {
        throw new Error('appointments can only be cancellled 24 hours in advance');
    }

    slot.status = 'AVAILABLE';
    slot.bookedBy = null;
    await slot.save();

    return slot;
};


const generateSlots = async () => {
    const slots = [];
    const now = new Date();
    
    for (let i = 1; i <= 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        
        for (let hour = 9; hour < 17; hour++) {
            const startTime = hour.toString().padStart(2, '0') + ':00';
            const endTime = (hour + 1).toString().padStart(2, '0') + ':00';
            
            slots.push({
                date: dateStr,
                startTime,
                endTime,
                status: 'AVAILABLE'
            });
        }
    }

    
    try {
        await AppointmentSlot.insertMany(slots, { ordered: false });
    } catch (e) {
        
    }
    
    return { message: 'Slots generated successfully' };
};

module.exports = {
    getAvailableSlots,
    getUserAppointments,
    bookAppointment,
    cancelAppointment,
    generateSlots
};

const mongoose = require('mongoose');

const appointmentSlotSchema = new mongoose.Schema({
    date: {
        type: String, 
        required: true,
        index: true
    },
    startTime: {
        type: String, 
        required: true
    },
    endTime: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BOOKED'],
        default: 'AVAILABLE'
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

appointmentSlotSchema.index({ date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('AppointmentSlot', appointmentSlotSchema);

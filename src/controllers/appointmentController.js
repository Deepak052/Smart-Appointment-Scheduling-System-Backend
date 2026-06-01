const asyncHandler = require('express-async-handler');
const appointmentService = require('../services/appointmentService');

const getAvailableSlots = asyncHandler(async (req, res) => {
    const { date } = req.query;
    try {
        const slots = await appointmentService.getAvailableSlots(date);
        res.status(200).json(slots);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const getMyAppointments = asyncHandler(async (req, res) => {
    try {
        const appointments = await appointmentService.getUserAppointments(req.user._id);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});
const bookAppointment = asyncHandler(async (req, res) => {
    try {
        const appointment = await appointmentService.bookAppointment(req.user._id, req.params.id);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const cancelAppointment = asyncHandler(async (req, res) => {
    try {
        const appointment = await appointmentService.cancelAppointment(req.user._id, req.params.id);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const generateSlots = asyncHandler(async (req, res) => {
    try {
        const result = await appointmentService.generateSlots();
        res.status(201).json(result);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {
    getAvailableSlots,
    getMyAppointments,
    bookAppointment,
    cancelAppointment,
    generateSlots
};

const express = require('express');
const router = express.Router();
const {
    getAvailableSlots,
    getMyAppointments,
    bookAppointment,
    cancelAppointment,
    generateSlots
} = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/available', protect, getAvailableSlots);
router.get('/my-appointments', protect, getMyAppointments);
router.post('/book/:id', protect, bookAppointment);
router.put('/cancel/:id', protect, cancelAppointment);
router.post('/generate', generateSlots); 

module.exports = router;

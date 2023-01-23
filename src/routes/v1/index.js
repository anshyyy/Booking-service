const express = require('express');

const router = express.Router();
const {BookingController} = require('../../controllers/index');


const bookingController = new BookingController();

router.post('/create-booking',bookingController.createBooking);
router.post('/publish',bookingController.sendMessageToQueue);


module.exports = router;
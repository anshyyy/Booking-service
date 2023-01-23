const express = require('express');

const router = express.Router();
const {BookingController} = require('../../controllers/index');
const {createChannel} = require('../../utils/messageQueue'); 
const channel = createChannel();

const bookingController = new BookingController(channel);

router.post('/create-booking',bookingController.createBooking);


module.exports = router;
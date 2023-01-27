
const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services/index');
const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig')


const bookingService = new BookingService();

class BookingController {

    sendMessageToQueue = async (data) => {
        try {
            const channel = await createChannel();
            publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
            return data;
        } catch (error) {
            throw error;
        }
    }

    createBooking = async (req, res) => {
        try {
            const bookedFlight = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                data: bookedFlight,
                message: "Successfully booked the flight",
                success: true,
                err: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode).json({
                message: error.message,
                data: {},
                success: false,
                err: error.explanation
            });
        }
    }

}

module.exports = BookingController;
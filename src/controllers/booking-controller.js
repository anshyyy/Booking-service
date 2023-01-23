
const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services/index');


const bookingService = new BookingService();

class BookingController {
    
    constructor(channel){
      this.channel = channel;
    }

    createBooking = async (req, res) => {
        try {
            console.log(req.body);
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
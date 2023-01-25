
const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services/index');
const {createChannel,publishMessage} = require('../utils/messageQueue'); 
const {REMINDER_BINDING_KEY} = require('../config/serverConfig')


const bookingService = new BookingService();

class BookingController {
    

    sendMessageToQueue = async (req,res) =>{
       try {
        const channel = await createChannel();
        const data = {message:"Success"};
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
        return res.status(200).json({
            message:"Successfully published the message"
        });
       } catch (error) {
        return res.status(501).json({
            message:"Something went wrong!!",
            err:error
        });
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
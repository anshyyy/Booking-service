const { Booking } = require('../models/index');
const { ValidationError, AppError } = require('../utils/error/index');
const { Statuscodes } = require('http-status-codes');

class BookingRepository {
    async create(data) {
        try {

            const booking = await Booking.create(data);
            return booking;

        } catch (error) {
            if (error.name == 'SequelizeValidationError') {
                throw new ValidationError();
            }
            console.log("Something went wrong in Repository layer");
            throw new AppError(
                'Repository Error',
                'Cannot create booking',
                'There was some issue creating the booking,please try again later',
                Statuscodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(bookingId,data){
        try {

           const booking = await Booking.findByPk(bookingId);
           if(data.status){
            booking.status = data.status;
           }
           await booking.save();
           return booking;
        } catch (error) {
            if (error.name == 'SequelizeValidationError') {
                throw new ValidationError();
            }
            console.log("Something went wrong in Repository layer");
            throw new AppError(
                'Repository Error',
                'Cannot Update booking',
                'There was some issue updating the booking,please try again later',
                Statuscodes.INTERNAL_SERVER_ERROR
            );
        }
    }


}
module.exports = BookingRepository;
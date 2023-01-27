const { BookingRepository } = require('../repository/index');
const axios = require('axios');
const { FLIGHT_SERVICE_PATH,AUTH_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/error/index');
const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig')


class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }
    async createBooking(data) {
        // in data we'll be getting userId, flightId, noOfSeats
        try {

            if (!data.userId) {
                console.log("You have to login first, to create a booking");
                throw new ServiceError('You have to login first, to create a booking');
            }
            // flight ID from the api call
            const flightId = data.flightId;
            //getting the flight data from the flight service
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
             console.log("data",flightData);
            // getting price of the flight
            let priceOftheFlight = flightData.price;
            if (data.noOfSeats > flightData.noOfSeats) {
                throw new ServiceError('Something went wrong in the booking service', 'Insufficient seats availale');
            }
            
            // calculating the totalCost of flight
            const totalCost = priceOftheFlight * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };
            // console.table(bookingPayload);
            //creating booking here in our own repository
            const booking = await this.bookingRepository.create(bookingPayload);
            //updating the seats in the flights
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/update-flight/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, { totalSeats: flightData.totalSeats - booking.noOfSeats });
            
             
            //updating the status of the flight
            var finalBooking = await this.bookingRepository.update(booking.id, { status: 'Booked' });
            // console.log(booking,finalBooking);
            const userDetailspath = `${AUTH_SERVICE_PATH}/api/v1/getById/${finalBooking.userId}`;
            const userDetails = await axios.get(userDetailspath);
            const ticket = {...finalBooking.dataValues,...userDetails.data.data[0],...flightData};
            const channel = await createChannel();
            await publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(ticket));
            return ticket;

        } 
         catch (error) {
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw error;
        }
    }
}
module.exports = BookingService;
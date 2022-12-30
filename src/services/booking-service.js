const {BookingRepository} = require('../repository/index');
const axios = require('axios');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const {ServiceError} = require('../utils/error/index');

class BookingService {
        constructor(){
            this.bookingRepository = new BookingRepository();
        }
        async createBooking(data) {
            try {
                  
                  const flightId = data.flightId;
                  let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
                  const response = await axios.get(getFlightRequestURL);
                  const flightData = response.data.data;
                  let priceOftheFlight = flightData.price;
                  if(data.noOfSeats > flightData.noOfSeats){
                    throw new ServiceError('Something went wrong in the booking service','Insufficient seats availale');
                  }
                  const totalCost = priceOftheFlight*data.noOfSeats;
                  const bookingPayload = {...data,totalCost};
                  const booking = await this.bookingRepository.create(bookingPayload);
                  const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/update-flight/${booking.flightId}`;
                  await axios.patch(updateFlightRequestURL,{totalSeats:flightData.totalSeats - booking.noOfSeats});
                  const finalBooking = await this.bookingRepository.update(booking.id,{status:'Booked'});
                  return finalBooking;

            } catch (error) {
                if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
                    throw error;
                }
                throw new ServiceError();
            }
        }
}
module.exports = BookingService;
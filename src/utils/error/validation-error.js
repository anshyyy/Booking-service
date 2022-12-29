const {StatusCodes} = require('http-status-codes');

class ValidationError extends Error {
    constructor(message,explantion,statusCodes){
           this.name = 'ValidationError',
           this.message = "Not able to validate the data sent in the request.",
           this.explantion = explantion
           this.statusCodes = StatusCodes.BAD_REQUEST
    }
}

module.exports = ValidationError;
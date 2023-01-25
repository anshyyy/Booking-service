const {StatusCodes} = require('http-status-codes');

class ValidationError extends Error {
    constructor(
        message = 'Something Went Wrong', 
        explanation = 'Not able to validate the data', 
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ){
           console.log("validation error->", explantion);
           super();
           this.name = 'ValidationError';
           this.message = message;
           this.explanation = explanation;
           this.statusCodes = statusCode;
    }
}

module.exports = ValidationError;
// it is a middleware, separate fn that is responsible for catching errors
const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {

    // cloning the err obj 
    let error = { ...err }

    //Updating the error message property of the cloned error object
    error.message = err.message
    console.log("error:", err)

    //custom err message for specific statuscode

    // Mongoose bad Objectid
    if (err.name === "CastError") {
        // getting the id from the err obj
        const message = `Resource not found in Id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field entered"
        error = new ErrorResponse(message, 400)
    }

    //Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server error"
    })
}
module.exports = errorHandler
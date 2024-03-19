// it is a custom error class that crates a custom err object with additional property status code

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        console.log("mesage:", message)
        super(message)
        this.statusCode = statusCode
    }
}
module.exports = ErrorResponse
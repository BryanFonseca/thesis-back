import CustomError from "./custom-error.js";

class RequestValidationError extends CustomError {
    statusCode = 403;
    errors;

    constructor(errors) {
        super('Validation error');
        this.errors = errors;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeError() {
        return this.errors.map(error => ({
            message: error.msg,
            field: error.param
        }));
    }
}

export default RequestValidationError;
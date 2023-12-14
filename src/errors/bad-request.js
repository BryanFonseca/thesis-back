import CustomError from "./custom-error.js";

class BadRequestError extends CustomError {
    statusCode = 400;
    description = "";

    constructor(description) {
        super("Bad request error");
        this.description = description;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeError() {
        return [
            {
                message: this.description,
            },
        ];
    }
}

export default BadRequestError;

import CustomError from "./custom-error.js";

class NotAuthorizedError extends CustomError {
    statusCode = 401;
    description = "";

    constructor(description) {
        super("Not authorized error");
        this.description = 'Usuario no autenticado';
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeError() {
        return [
            {
                message: this.description,
            },
        ];
    }
}

export default NotAuthorizedError;

import CustomError from "../errors/custom-error.js";

function errorHandler(err, req, res, next) {
    console.error("Some error occurred", err);

    if (err instanceof CustomError) {
        return res
            .status(err.statusCode)
            .send({ errors: err.serializeError() });
    }

    res.status(400).send({
        message: err.message,
    });
}

export default errorHandler;

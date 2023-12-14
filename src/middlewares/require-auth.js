import NotAuthorizedError from "../errors/not-authorized-error.js";

function requireAuth(req, res, next) {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }
    next();
}


export default requireAuth;
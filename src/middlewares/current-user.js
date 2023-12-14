import jwt from "jsonwebtoken";

function currentUser(req, res, next) {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentUser = payload;
    } catch (error) {}
    next();
}

export default currentUser;
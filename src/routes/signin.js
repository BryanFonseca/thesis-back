import express from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import validateRequest from "../middlewares/validate-request.js";
import { User } from "../sequelize/sequelize.js";
import BadRequestError from "../errors/bad-request.js";
import Password from "../helpers/password.js";

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password"),
    ],
    validateRequest,
    async (req, res) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) throw new BadRequestError("Invalid credentials");

        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );
        if (!passwordsMatch) throw new BadRequestError("Invalid credentials");

        console.log(existingUser.id);
        console.log(existingUser.email);
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY
        );

        req.session = {
            jwt: userJwt,
        };

        res.status(200).send(existingUser);
    }
);

export default router;

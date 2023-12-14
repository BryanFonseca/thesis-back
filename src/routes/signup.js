import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validate-request.js";
import { User } from "../sequelize/sequelize.js";
import BadRequestError from "../errors/bad-request.js";
import nodemailer from "nodemailer";
import Password from "../helpers/password.js";

const router = express.Router();

router.post(
    "/api/users/signup",
    [
        body("firstName")
            .trim()
            .isLength({ min: 2, max: 20 })
            .withMessage("Name must be between 2 and 4 characters"),
        body("lastName")
            .trim()
            .isLength({ min: 2, max: 20 })
            .withMessage("Lastname must be between 2 and 4 characters"),
        body("email").isEmail().withMessage("Email must be valid"),
    ],
    validateRequest,
    async function (req, res) {
        const { firstName, lastName, email } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser)
            throw new BadRequestError(
                `User with email ${email} already exists`
            );

        const signupCode = getSignupCode();

        const createdUser = await User.create({
            firstName,
            lastName,
            email,
            password: signupCode,
        });

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "6f5b755d8fd979",
                pass: "616fc793700b95",
            },
        });

        // Insertarla encriptada como contraseña

        const info = await transporter.sendMail({
            from: '"UNEMI Segura" <thesis@unemisegura.com>', // sender address
            to: email, // list of receivers
            subject: "Creación de cuenta ✔", // Subject line
            html: `<div>Cuenta creada. Tu código de acceso es: <strong>${signupCode}</strong></div>`, // html body
        });

        // console.log("Message sent: %s", info.messageId);

        res.status(201).send(createdUser);
    }
);

router.post(
    "/api/users/signup/enable",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("signupCode")
            .trim()
            .isNumeric()
            .isLength({ min: 6, max: 6 })
            .withMessage("signupCode must have 6 characters"),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 characters"),
    ],
    validateRequest,
    async function (req, res) {
        const { email, signupCode, password } = req.body;
        console.log(
            "Creating user",
            email,
            "with password",
            password,
            "and signup code",
            signupCode
        );

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser)
            throw new BadRequestError(
                `User with email ${email} does not exist`
            );

        const isValidCode = await Password.compare(
            existingUser.password,
            signupCode
        );
        if (!isValidCode) throw new BadRequestError(`Incorrect code`);

        // Recuperar contraseña y compararla con signupCode, si coincide, actualizarla con la nueva contraseña y activar usuario
        existingUser.password = password;
        existingUser.save();

        res.status(200).send({ message: "User enabled" });
    }
);

function getSignupCode() {
    return new Array(6)
        .fill(0)
        .map(() => Math.floor(Math.random() * 9))
        .join("");
}

export default router;

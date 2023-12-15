import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validate-request.js";
import { User } from "../sequelize/sequelize.js";
import BadRequestError from "../errors/bad-request.js";
import nodemailer from "nodemailer";
import Password from "../helpers/password.js";
import jwt from 'jsonwebtoken';

const USER_TYPES = {
    ESTUDIANTE: 'ESTUDIANTE',
    GUARDIA: 'GUARDIA'
}

const router = express.Router();

router.post(
    "/api/users/guard/signup",
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
                `Usuario con email ${email} ya existe`
            );

        const signupCode = getSignupCode();

        const createdUser = await User.create({
            firstName,
            lastName,
            email,
            password: signupCode,
            isEnabled: true,
            type: USER_TYPES.GUARDIA
        });

        console.log('Signup code is', signupCode);

        /*
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
            html: `<div style="font-family: sans-serif;">
                    <div style="height: 100px; background-color: #00B8A9"></div>    

                    <div style="max-width: 600px; margin: 0 auto;">

                            <h1 style="font-size: 24px; margin-bottom: 20px;">Bienvenido a UNEMI Segura</h1>

                            <p style="font-size: 18px; line-height: 1.6;">
                                Estimado/a <span style="font-weight: bold;">${createdUser.firstName} ${createdUser.lastName}</span>,
                                <br><br>
                                Nos complace darte la bienvenida a UNEMI Segura, la aplicación que vela por tu seguridad.
                                <br><br>
                                Tu código de confirmación es: <span style="font-weight: bold;">${signupCode}</span>. Te recomendamos mantener este código de manera confidencial.
                                <br><br>
                                Gracias por confiar en UNEMI Segura. ¡Esperamos que tu experiencia sea excelente!
                            </p>

                        </div>
                    <div style="height: 100px; background-color: #00B8A9"></div>   

                    </div>`,
        });
        */

        res.status(201).send(createdUser);
    }
);

// Esto asume que el usuario tiene correo institucional
// y solo debe ser usado por estudiantes
router.post(
    "/api/users/student/signup",
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
                `Usuario con email ${email} ya existe`
            );

        const signupCode = getSignupCode();

        const createdUser = await User.create({
            firstName,
            lastName,
            email,
            password: signupCode,
            type: USER_TYPES.ESTUDIANTE
        });

        console.log('Signup code is', signupCode);

        /*
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
            html: `<div style="font-family: sans-serif;">
                    <div style="height: 100px; background-color: #00B8A9"></div>    

                    <div style="max-width: 600px; margin: 0 auto;">

                            <h1 style="font-size: 24px; margin-bottom: 20px;">Bienvenido a UNEMI Segura</h1>

                            <p style="font-size: 18px; line-height: 1.6;">
                                Estimado/a <span style="font-weight: bold;">${createdUser.firstName} ${createdUser.lastName}</span>,
                                <br><br>
                                Nos complace darte la bienvenida a UNEMI Segura, la aplicación que vela por tu seguridad.
                                <br><br>
                                Tu código de confirmación es: <span style="font-weight: bold;">${signupCode}</span>. Te recomendamos mantener este código de manera confidencial.
                                <br><br>
                                Gracias por confiar en UNEMI Segura. ¡Esperamos que tu experiencia sea excelente!
                            </p>

                        </div>
                    <div style="height: 100px; background-color: #00B8A9"></div>   

                    </div>`,
        });
        */

        res.status(201).send(createdUser);
    }
);

router.post(
    "/api/users/student/signup/enable",
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
        existingUser.isEnabled = true;
        await existingUser.save();

        console.log(process.env.JWT_KEY);
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY);

        req.session.jwt = userJwt;

        // res.status(200).send({ message: "Usuario activado", user: existingUser });
        res.status(200).send(existingUser);
    }
);

function getSignupCode() {
    return new Array(6)
        .fill(0)
        .map(() => Math.floor(Math.random() * 9))
        .join("");
}

export default router;

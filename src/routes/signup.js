import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validate-request.js";

const router = express.Router();

router.post(
    "/api/users/signup",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 characters"),
    ],
    validateRequest,
    async function (req, res) {
        const { email, password } = req.body;
        console.log(email, password);
        res.status(200).send({});
    }
);

export default router;

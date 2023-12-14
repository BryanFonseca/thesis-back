
import express from "express";
import { User } from "../sequelize/sequelize.js";
import BadRequestError from "../errors/bad-request.js";
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";

const router = express.Router();

// Esto asume que el usuario tiene correo institucional
router.get(
    "/api/users/", currentUser, requireAuth,
    async function (req, res) {
        const users = await User.findAll();
        res.status(201).send(users);
    }
);

export default router;

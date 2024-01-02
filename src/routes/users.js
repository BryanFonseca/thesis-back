import express from "express";
import { Guard, User } from "../sequelize/sequelize.js";
import BadRequestError from "../errors/bad-request.js";
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";
import { Op } from "sequelize";

const router = express.Router();

// Esto asume que el usuario tiene correo institucional
router.get("/api/users/", currentUser, requireAuth, async function (req, res) {
    const users = await User.findAll();
    res.status(200).send(users);
});

router.get("/api/guards/", /*currentUser, requireAuth,*/ async function (req, res) {
    const guards = await User.findAll({
        include: [
            {
                model: Guard,
                required: true
            },
        ],
    });
    res.status(200).send(guards.map(({id: userId, firstName, lastName, email}) => ({
        userId,
        firstName,
        lastName,
        email
    })));
});

export default router;

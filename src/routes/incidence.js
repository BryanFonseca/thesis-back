import express from "express";
import { Guard, Incidence, Student, User } from "../sequelize/sequelize.js";
import { body } from "express-validator";
import WebPush from "web-push";
import validateRequest from "../middlewares/validate-request.js";
import BadRequestError from "../errors/bad-request.js";

const router = express.Router();

// TODO: Enviar notificación push a guardia

router.post(
    "/api/incidence",
    [
        body("userId").isNumeric().withMessage("userId must be a number id"),
        body("latitude")
            .isNumeric()
            .withMessage("latitude must be a signed decimal number"),
        body("longitude")
            .isNumeric()
            .withMessage("latitude must be a signed decimal number"),
    ],
    validateRequest,
    async (req, res) => {
        // TODO: Insertar en tabla de incidencia el usuario, su ubicación y el guardia más cercano
        // TODO: Esto implica que se debe tener la ubicación del guardia. El endpoint que recibe la ubicación
        // TODO: debe guardarlo en un campo (lat & lng)

        /*
        Esto puede implementarse con un campo nullable. O ser una entidad a parte.  
        Tal vez podría haber una entidad aparte 'Ubicación' que podría conseguirse desde los usuarios, es decir
        usuario.getUbicacion() cuando el usuario tenga tipo 'GUARDIA'.
        Qué sucedería su heredo en una clase Guardia el modelo Estudiante y 
    */

        // Hacer select de usuarios que sean guardias, conseguir ubicación y quedarnos con el más cercano.
        const { userId, latitude, longitude } = req.body;
        const user = await User.findByPk(userId);
        const student = await user.getStudent();
        const coords = { latitude, longitude };
        // console.log(user);

        // TODO: find closest guard
        const maybeGuard = await User.findOne({
            where: { email: "clopez@gmail.com" },
            // include: [
            //     {
            //         model: Guard,
            //         required: true,
            //         where: {}
            //     }
            // ],
        });
        const guard = await maybeGuard.getGuard();
        if (guard.pushSubscription) {
            // throw new BadRequestError(
            //     "Ningún guardia está suscrito a notificaciones push"
            // );
            const notificationResult = await WebPush.sendNotification(
                guard.pushSubscription,
                JSON.stringify({
                    body: `El estudiante ${user.firstName} ${user.lastName} reportó una incidencia`,
                })
            );
            console.log(notificationResult);
        }


        const incidence = await Incidence.create({
            StudentId: student.id,
            GuardId: guard.id,
            latitude,
            longitude
        });
        console.log(incidence);

        res.status(200).send({});
    }
);

router.get("/api/incidence/:id", async (req, res) => {
    const incidenceId = req.params.id;
    const incidences = await Incidence.findAll({
        include: [
            {
                model: Student,
                include: User,
            },
            {
                model: Guard,
                include: User,
            },
        ],
        where: {
            id: incidenceId
        }
    });
    res.status(200).send(incidences.at(0));
});

router.get("/api/incidence", async (_, res) => {
    // TODO: antes de retornarlo, calcular distancia, o implementarlo como columna virtual
    const incidences = await Incidence.findAll({
        include: [
            {
                model: Student,
                include: User,
            },
            {
                model: Guard,
                include: User,
            },
        ],
        order: [['createdAt', 'DESC']],
    });
    res.status(200).send(incidences);
});

export default router;

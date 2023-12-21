import express from "express";
// import { PushNotificationSubscriptions } from "../sequelize/sequelize.js";
import WebPush from "web-push";
import { User } from "../sequelize/sequelize.js";

const router = express.Router();

WebPush.setVapidDetails(
    "mailto:bfonsecat@unemi.edu.ec",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Debería suceder cuando se loguee, tal vez no debería ser un endpoint a parte
router.post("/api/notifications/save-subscription", async (req, res) => {
    const {email, subscription} = req.body;

    // Buscar usuario por email
    const existingUser = await User.findOne({where: {email}})
    // Guardar suscripción en el usuario
    existingUser.pushSubscription = subscription;
    await existingUser.save();

    res.status(201).send({ data: { success: true } });
});

// Send notification test
router.post("/api/notifications/send", async (req, res) => {
    const users = await User.findAll();
    // const subscriptions = await PushNotificationSubscriptions.findAll();
    for (const { pushSubscription } of users) {
        if (!pushSubscription) continue;
        const notificationResult = await WebPush.sendNotification(
            pushSubscription,
            JSON.stringify({
                body: "Some body yo",
            })
        );
        console.log(notificationResult);
    }
    res.status(200).send({ sent: true });
});

export default router;

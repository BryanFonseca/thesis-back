import express from "express";
import { PushNotificationSubscriptions } from "../sequelize/sequelize";

const router = express.Router();

router.post("/api/notifications/save-subscription", async (req, res) => {
    const createdSubscription = await PushNotificationSubscriptions.create({
        subscription: req.body,
    });
    res.status(201).send({ data: { success: true } });
});

export default router;

import express from "express";
import { PushNotificationSubscriptions } from "../sequelize/sequelize.js";
import {setVapidDetails} from 'web-push';

const router = express.Router();

router.post("/api/notifications/save-subscription", async (req, res) => {
    const createdSubscription = await PushNotificationSubscriptions.create({
        subscription: req.body,
    });
    res.status(201).send({ data: { success: true } });
});

// Send notification test
router.post("/api/notifications/send", async (req, res) => {
    // webpus
});

export default router;

import "dotenv/config";
import express from "express";
import "express-async-errors";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import "./sequelize/sequelize.js";
import "./seed.db.js";

import signupRouter from "./routes/signup.js";
import signinRouter from "./routes/signin.js";
import signoutRouter from "./routes/signout.js";
import usersRouter from "./routes/users.js";
import pushNotificationsRouter from "./routes/push-notifications.js";
import incidenceRouter from "./routes/incidence.js";

import errorHandler from "./middlewares/error-handler.js";
import cookieSession from "cookie-session";
import currentUser from "./middlewares/current-user.js";
import requireAuth from "./middlewares/require-auth.js";
import { Guard, User } from "./sequelize/sequelize.js";

const app = express();

app.use(express.json());
app.use(
    cookieSession({
        signed: false, // disables encryption
        // sameSite: 'None',
        // secure: false
    })
);

app.use(cors({ 
    origin: 'https://bfonseca-thesis-demo.netlify.app',
    credentials: true,
}));

// Routing
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(usersRouter);
app.use(pushNotificationsRouter);
app.use(incidenceRouter);

app.get("/api/test", currentUser, requireAuth, (req, res) => {
    res.status(200).send({ test: true });
});

app.use(errorHandler);

// The http server wraps the express app
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// En este caso, el usuario es quien envía la data, no hace falta comunicación bilateral de socket
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("POSITION_UPDATE", async (data) => {
        console.log("Recieved data:", data);
        const { userId, lat: latitude, lng: longitude } = data;
        // TODO: Update userId guard position
        const guard = await User.findByPk(userId);
        console.log(guard.currentPosition);
        guard.currentPosition = {
            latitude,
            longitude,
           // Para prueba
           /*
           latitude: -2.15086,
           longitude: -79.60328
           */
        };
        await guard.save();
        // TODO: Send the position of every guard
        const guards = await User.findAll({
            include: [
                {
                    model: Guard,
                    required: true,
                },
            ],
        });
        const guardsPositions = guards.map((guardia) => ({
            id: guardia.Guard.UserId,
            firstName: guardia.firstName,
            lastName: guardia.lastName,
            email: guardia.email,
            currentPosition: guardia.currentPosition,
        }));
        io.emit("POSITION_UPDATE", guardsPositions);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

app.get("/", (req, res) => {
    res.send({ test: "hi" });
});

app.post("/location", (req, res) => {
    console.log(req.body);
    io.emit("location", req.body);
    res.send({});
});

// Proxy sga
app.get("/sga-proxy", async (req, res) => {
    const url = req.query.url;
    const response = await fetch(url);
    const data = await response.text();
    res.send(data);
});

const init = async () => {
    try {
        // await sequelize.sync({ force: true });
        // Tests the connection
        // (await sequelize).authenticate();

        console.log("Successfully connected to MySQL Database");

        server.listen(3000, () => {
            console.log("Listening on port 3000");
        });
    } catch (error) {
        console.error(error);
    }
};

init();

import "dotenv/config";
import express from "express";
import "express-async-errors";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import _ from "./sequelize/sequelize.js";

import signupRouter from "./routes/signup.js";
import signinRouter from "./routes/signin.js";
import signoutRouter from "./routes/signout.js";
import usersRouter from './routes/users.js';

import errorHandler from "./middlewares/error-handler.js";
import cookieSession from "cookie-session";
import currentUser from "./middlewares/current-user.js";
import requireAuth from "./middlewares/require-auth.js";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
    cookieSession({
        signed: false, // disables encryption
        // secure: true
    })
);

app.use(cors({ origin: "*" }));

// Routing
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(usersRouter);

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
    /*
    socket.on('location', (data) => {
        console.log('Recieved data:', data);
        // when data arrives it should be sent to the admin
    });
    */
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

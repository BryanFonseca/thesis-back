import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors({ origin: "*" }));

// The http server wraps the express app
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
    res.send({ test: "hi" });
});

app.post("/location", (req, res) => {
    console.log(req.body);
    io.emit('location', req.body);
    res.send({});
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

server.listen(3000, () => {
    console.log("Listening on port 3000");
});

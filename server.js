import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

import { CLIENT_URLS, PORT } from "./config.js";
import { connectToMongo } from "./dal/dal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import User from "./routes/user.route.js";
import Chat from "./routes/chat.route.js";

const app = express();
const server = createServer(app);

const waitingUsers = [];

app.use(cookieParser());

const io = new Server(server, {
    cors: {
        origin: JSON.parse(CLIENT_URLS),
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`> User connected : ${socket.id}`);

    // Updated to handle peer signaling for simple-peer
    socket.on("peer_signal", (data) => {
        const { roomID, signal } = data;
        console.log(`> Peer signal received for room: ${roomID}`);
        console.log(signal);

        // Broadcast the signal to other users in the same room
        socket.to(roomID).emit("peer_signal", {
            signal,
            from: socket.id,
        });
    });

    socket.on("add_offer", (data) => {
        const roomID = data.roomID;
        const offer = data.offer;
        const partnerSocket = roomID.split(socket.id)[0]
            ? roomID.split(socket.id)[0]
            : roomID.split(socket.id)[1];
        console.log(
            `> Offer received for room: ${roomID} sending to ${partnerSocket} from socket ${socket.id}`,
        );
        if (partnerSocket)
            socket.to(partnerSocket).emit("add_offer", { roomID, offer });
    });

    socket.on("add_answer", (data) => {
        const roomID = data.roomID;
        const answer = data.answer;
        const partnerSocket = roomID.split(socket.id)[0]
            ? roomID.split(socket.id)[0]
            : roomID.split(socket.id)[1];
        socket.to(partnerSocket).emit("add_answer", { roomID, answer });
    });

    socket.on("ice_candidates", (data) => {
        const roomID = data.roomID;
        const candidates = data.candidates;
        const partnerSocket = roomID.split(socket.id)[0]
            ? roomID.split(socket.id)[0]
            : roomID.split(socket.id)[1];
        socket.to(partnerSocket).emit("ice_candidates", { roomID, candidates });
    });

    socket.on("find_partner", (data) => {
        if (waitingUsers.length > 0 && waitingUsers[0].id !== socket.id) {
            const partnerSocket = waitingUsers.pop();
            const roomID = socket.id + partnerSocket.id;

            socket.userID = data?.username ? data.username : data.uuid;
            socket.roomID = roomID;

            socket.join(roomID);
            partnerSocket.join(roomID);

            const partnerInfo = {
                id: partnerSocket.id,
                username: partnerSocket.userID,
            };

            console.log(
                `> Partner found -> Paired ${socket.userID} with ${partnerSocket.userID}`,
            );

            socket.emit("partner_found", {
                roomID,
                username: partnerSocket.userID,
                partnerSocket: partnerInfo,
                isInitiator: true,
            });

            partnerSocket.emit("partner_found", {
                roomID,
                username: socket.userID,
                partnerSocket: {
                    id: socket.id,
                    username: socket.userID,
                },
                isInitiator: false,
            });
        } else {
            socket.userID = data?.username ? data.username : data.uuid;
            waitingUsers.push(socket);
            console.log(
                `> No Partner found -> Pushed to waiting list : ${socket.userID}`,
            );
        }
    });

    socket.on("send_message", (messageData) => {
        const { roomID, message } = messageData;

        io.to(roomID).emit("receive_message", {
            username: socket.userID,
            message,
            timestamp: new Date().toISOString(),
        });
    });

    socket.on("disconnect", () => {
        const index = waitingUsers.findIndex((s) => s.id === socket.id);
        if (index !== -1) {
            waitingUsers.splice(index, 1);
        }

        socket.to(socket.roomID).emit("partner_disconnected");
    });
});

const logger = pino({
    level: "info",
});

console.log("CLIENT_URLS", JSON.parse(CLIENT_URLS));
app.use(
    cors({
        credentials: true,
        origin: JSON.parse(CLIENT_URLS),
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);

app.options(JSON.parse(CLIENT_URLS), cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    pinoHttp({
        logger,
        customLogLevel: function (res, err) {
            if (res.statusCode >= 400 && res.statusCode < 500) return "warn";
            if (res.statusCode >= 500 || err) return "error";
            return "info";
        },
        ignore: "res",
    }),
);

app.use("/user", User);
app.use("/chat", Chat);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/", "index.html"));
});

await connectToMongo()
    .then(() =>
        server.listen(PORT || 8080, () => {
            console.log(`Server running on PORT: ${PORT}`);
        }),
    )
    .catch((error) => {
        console.log(`Unable to start the server : ${error.message}`);
    });

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
    console.log("User connected");
    console.log(socket.id);

    socket.on("find_partner", async (data) => {
        if (waitingUsers.length > 0 && waitingUsers[0].id !== socket.id) {
            console.log("Partner found > Setting up connection for users");
            const partnerSocket = waitingUsers.pop();
            const roomID = socket.id + partnerSocket.id;
            socket.userID = data?.username ? data.username : data.uuid;

            socket.join(roomID);
            partnerSocket.join(roomID);

            console.log("Partner found > Setting up connection for users");
            socket.emit("partner_found", {
                roomID,
                username: partnerSocket.userID,
                partnerSocketID: partnerSocket.id,
            });
            partnerSocket.emit("partner_found", {
                roomID,
                username: socket.userID,
                partnerSocketID: socket.id,
            });
        } else {
            console.log("No Partner found > Pushed to user queue");
            console.log(data);
            socket.userID = data?.username ? data.username : data.uuid;
            waitingUsers.push(socket);
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

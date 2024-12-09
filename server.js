import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";

import { CLIENT_URLS, PORT } from "./config.js";
import { connectToMongo } from "./dal/dal.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import User from "./routes/user.route.js";
import Chat from "./routes/chat.route.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: JSON.parse(CLIENT_URLS),
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected");
    console.log(socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected");
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

app.use(cookieParser());

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

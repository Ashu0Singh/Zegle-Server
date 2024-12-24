import pino from "pino";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transport = {
    targets: [
        {
            target: "pino/file",
            options: {
                destination: `${__dirname}/logs/zegle-server.log`,
            },
            level: "info",
        },
        {
            target: "pino/file",
            options: {
                destination: `${__dirname}/logs/zegle-server.error.log`,
            },
            level: "error",
        },
    ],
};

const pinoTransport = pino.transport(transport);
const logger = pino(pinoTransport);

export default logger;

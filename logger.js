import pino from "pino";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({
    level: "info",
    transport: {
        targets: [
            {
                target: "pino/file",
                options: { destination: `${__dirname}/logs/zegle-server.log` },
                level: "info",
            },
        ],
    },
});

export default logger;

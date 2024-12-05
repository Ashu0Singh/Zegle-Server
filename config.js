import { configDotenv } from "dotenv";

configDotenv();

export const PORT = process.env.PORT;
export const JWT_AUTH_SECRET_KEY = process.env.JWT_AUTH_SECRET_KEY;
export const CLIENT_URL = process.env.CLIENT_URL;
export const MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI;

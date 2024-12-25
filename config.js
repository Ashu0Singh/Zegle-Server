import { configDotenv } from "dotenv";

configDotenv();

export const PORT = process.env.PORT;
export const JWT_AUTH_SECRET_KEY = process.env.JWT_AUTH_SECRET_KEY;
export const CLIENT_URLS = process.env.CLIENT_URLS;
export const MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI;
export const ENV = process.env.ENV;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_USER = process.env.REDIS_USER;
export const REDIS_PASS = process.env.REDIS_PASS;
export const REDIS_URI = process.env.REDIS_URI;
export const CLIENT_URL = process.env.CLIENT_URL;
export const RESEND_EMAIL_SECRET = process.env.RESEND_EMAIL_SECRET;
export const EMAIL_SALT = process.env.EMAIL_SALT;
export const SERVER_URL = process.env.SERVER_URL;

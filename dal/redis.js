import {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_USER,
    REDIS_PASS,
    REDIS_URI,
} from "../config.js";

import Redis from "ioredis";

const REDIS_CONNECTION_DATA = REDIS_URI
    ? REDIS_URI
    : {
          username: REDIS_USER,
          password: REDIS_PASS,
          host: REDIS_HOST,
          port: REDIS_PORT,
      };

let redisClient;
export const getRedisClient = async () => {
    try {
        if (redisClient?.status !== "ready") {
            console.log("Connecting to Redis");
            redisClient = new Redis(REDIS_CONNECTION_DATA);
        }
        return redisClient;
    } catch (error) {
        console.log("Error while connecting to Redis", error);
        throw new Error("Error while connecting to Redis");
    }
};

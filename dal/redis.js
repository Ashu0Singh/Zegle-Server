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

export const pushToRedisQueue = async (queueName, data) => {
    try {
        const redis = await getRedisClient();
        const queue = await redis.get(queueName).then(JSON.parse);
        const newQueue = queue ? [...queue, data] : [data];
        await redis.set(queueName, JSON.stringify(newQueue));
    } catch (error) {
        console.log("Error while adding to Redis queue", error);
        throw new Error("Error while adding to Redis queue");
    }
};

export const popFromRedisQueue = async (queueName) => {
    try {
        const redis = await getRedisClient();
        const queue = await redis.get(queueName).then(JSON.parse);
        if (!queue) {
            return null;
        }
        const [data, ...newQueue] = queue;
        await redis.set(queueName, JSON.stringify(newQueue));
        return data;
    } catch (error) {
        console.log("Error while popping from Redis queue", error);
        throw new Error("Error while popping from Redis queue");
    }
};

export const addToRedisSet = async (socketID, username) => {
    try {
        const redis = await getRedisClient();
        await redis.set(socketID, username);
    } catch (error) {
        console.log("Error while adding to Redis set", error);
        throw new Error("Error while adding to Redis set");
    }
};

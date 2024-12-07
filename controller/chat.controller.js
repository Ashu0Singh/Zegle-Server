import { getRedisClient } from "../dal/redis.js";

export const Chat = async (req, res) => {
    try {
        const redis = await getRedisClient();
        await redis.set("foo", "bar");
        const message = await redis.get("foo");
        return res.status(200).json({ message });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

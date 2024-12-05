import mongoose from "mongoose";
import { MONGO_CONNECTION_URI } from "./config.js";
import User from "./models/User.schema.js";

export const connectToMongo = async () => {
    await mongoose
        .connect(MONGO_CONNECTION_URI)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            throw new Error(
                `Error connecting to MongoDB : ${err.message}`,
                err,
            );
        });
};

export const getUserDataByID = async (_id) => {
    const user = await User.findOne({ _id });
    return user;
};

export const updateUserDataByID = async (_id, data) => {
    const user = await User.findOneAndUpdate({ _id }, data);
    return user;
};

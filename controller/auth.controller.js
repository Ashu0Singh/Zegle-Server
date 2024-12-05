import User from "../models/User.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_AUTH_SECRET_KEY } from "../config.js";

export const SignUp = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(401).json({ error: "Email already in use" });
        }
        const userNameCheck = await User.findOne({ username });
        if (userNameCheck) {
            return res.status(401).json({ error: "Username already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            email,
            tier: "free",
            firstname,
            lastname,
            age: null,
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_AUTH_SECRET_KEY, {
            expiresIn: "2h",
        });

        const cookieOptions = {
            secure: true,
            httpOnly: true,
            maxAge: 7200000,
        };

        res.cookie("jwtToken", token, cookieOptions);

        res.status(200).json({
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        throw new Error(
            `Error : While registering a new user \n${error.message}`,
            error,
        );
    }
};

export const Login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }],
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_AUTH_SECRET_KEY, {
            expiresIn: "2h",
        });
        const cookieOptions = {
            secure: true,
            httpOnly: true,
            maxAge: 7200000, //maxAge 2hours
        };

        res.cookie("jwtToken", token, cookieOptions);

        res.status(200).json({
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        throw new Error(
            `Error : While loging in a user \n${error.message}`,
            error,
        );
    }
};

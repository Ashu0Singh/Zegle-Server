import bcrypt from "bcrypt";
import {
    getUserDataByID,
    updateUserDataByEmail,
    updateUserDataByID,
} from "../dal/dal.js";
import { confirmationEmail } from "../email/confirmationEmail.js";
import { sendEmail } from "../email/sendEmail.js";
import { CLIENT_URL, EMAIL_SALT } from "../config.js";

export const User = async (req, res) => {
    const _id = req?.user_id?.userId;
    const user = await getUserDataByID(_id);

    if (!user) {
        return res.status(400).json({ error: "No such user exists" });
    }
    return res.status(200).json({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        age: user.age,
        email: user.email,
        avatar: user.avatar,
        tier: user.tier,
        verified: user.verified,
    });
};

export const SaveUser = async (req, res) => {
    const _id = req?.user_id?.userId;
    const updatedData = req.body;

    try {
        const updateUser = await updateUserDataByID(_id, {
            firstname: updatedData.firstname,
            lastname: updatedData.lastname,
            age: updatedData.age,
            avatar: updatedData.avatar,
        });
        return res.status(200).json({
            username: updateUser.username,
            firstname: updateUser.firstname,
            lastname: updateUser.lastname,
            age: updateUser.age,
            email: updateUser.email,
            avatar: updateUser.avatar,
            tier: updateUser.tier,
        });
    } catch {
        return res.status(400).json({ error: "Error while updating userdata" });
    }
};

export const VerifyUserEmail = async (req, res) => {
    const { email, token } = req.body;
    const hash = await bcrypt.hash(`${email}-${EMAIL_SALT}`, 8);
    const link = `${CLIENT_URL}/verify?token=${hash}`;

    if (token) {
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        } else {
            const compare = await bcrypt.compare(
                `${email}-${EMAIL_SALT}`,
                token,
            );
            if (compare) {
                await updateUserDataByEmail(email, { verified: true });
                return res.status(200).json({ message: "Token verified" });
            } else {
                return res.status(400).json({ error: "Invalid token" });
            }
        }
    }
    const VerifyUserEmail = confirmationEmail(link);
    const isSent = await sendEmail(
        email,
        "Zegle : Verify your email",
        VerifyUserEmail,
    );
    if (isSent) {
        return res.status(200).json({ message: "Email sent" });
    } else {
        return res.status(500).json({ error: "Error while sending email" });
    }
};

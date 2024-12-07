import { getUserDataByID, updateUserDataByID } from "../dal/dal.js";

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

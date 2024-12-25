import { addFeedback } from "../dal/dal.js";
import logger from "../logger.js";

export const Feedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        if (!feedback) {
            return res.status(400).json({ message: "Feedback is required" });
        }
        await addFeedback(feedback);
        return res.status(200).json({ message: "Feedback received" });
    } catch (error) {
        logger.error(error, "Error while loging in a user");
        return res.status(500).json({ message: error.message });
    }
};

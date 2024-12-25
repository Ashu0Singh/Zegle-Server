import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    email: { type: String },
    message: { type: String, required: true },
});

feedbackSchema.index({ email: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;

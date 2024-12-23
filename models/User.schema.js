import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    firstname: { type: String, required: true },
    lastname: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    age: { type: Number },
    tier: { type: String },
    oAuth: { type: String },
    password: { type: String },
    verified: { type: Boolean, default: false },
});

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;

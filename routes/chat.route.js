import { Router } from "express";
import { Chat } from "../controller/chat.controller.js";

const router = Router();

router.get("/", Chat);

export default router;

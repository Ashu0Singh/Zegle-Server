import { Router } from "express";
import { Login, SignUp } from "../controller/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { SaveUser, User } from "../controller/user.controller.js";

const router = Router();

router.put("/signup", SignUp);
router.post("/login", Login);
router.use(authenticateToken);
router.get("/", User);
router.put("/", SaveUser);

export default router;

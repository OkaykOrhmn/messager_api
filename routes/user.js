import express from "express";
import { userController } from "../controller/user.js";
import { authentication } from "../middleware/auth.js";
const router = express.Router()

router.get('/profile', authentication.auth, userController.getUser);
router.post('/register', userController.registerUser);


export default router;

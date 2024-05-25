import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schema/user.js';
import {auth} from '../middleware/auth.js'

const userRouter = Router();


userRouter.post('/register',
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    async (req, res) => {
        const validationCheck = validationResult(req);
        if (!validationCheck.isEmpty()) {
            return res.status(400).send("Validation failed, please register again.");
        }

        try {
            const { username, password } = req.body;
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).send("User already exists.");
            }

            const hashpassword = await bcrypt.hash(password, 10);
            const NewUser = new User({ username, password: hashpassword });
            await NewUser.save();
            return res.status(200).send("User registered successfully.");
        } catch (error) {
            console.error("Error occurred while account registration:", error);
            return res.status(500).send("Error occurred while account registration.");
        }
    });

userRouter.post('/login',
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
    async(req,res)=>{
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).send("User not found.");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send("Wrong password.");
            }

            const token = jwt.sign({ username }, "greensafar123");
            res.cookie("userToken", token);
            return res.status(200).send("User logged in successfully.");
        } catch (error) {
            console.error("Internal server error:", error);
            return res.status(500).send("Internal server error.");
        }
    });

userRouter.get("/logout",auth,(req,res)=>{
    res.clearCookie("userToken");
    return res.status(200).send("User logged out successfully.");
});

export default userRouter;

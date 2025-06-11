import express, { Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from "../models/user";
import { validateRequest, BadRequestError } from "@my-micro-service/common";


const router = express.Router();

router.post(
    "/api/users/signup",
    [
        body('email').isEmail().withMessage("Enter a valid email Id"),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage("Enter the password with minimum length 4 and max length of 20")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError("Email already in use");
        }

        const user = User.build({ email, password });
        await user.save();

        const userToken = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);

        req.session = {
            jwt: userToken
        }

        res.status(201).send({ user });
    });

export { router as signupRoute }; 
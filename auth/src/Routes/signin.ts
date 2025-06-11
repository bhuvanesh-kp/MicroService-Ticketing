import express, { Request, Response } from "express";
import { body } from 'express-validator'
import { Password } from "../services/password";
import { User } from "../models/user";
import { validateRequest, BadRequestError } from "@my-micro-service/common";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signin",
  [
    body('email').isEmail().withMessage("Enter a valid email Id"),
    body('password').trim().isEmpty().withMessage("Password must be specified")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const confirmPassword = Password.compare(existingUser.password, password);
    if (!confirmPassword) {
      throw new BadRequestError("Invalid Credentials pls Try again");
    }

    const userToken = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    req.session = {
      jwt: userToken
    }

    res.status(201).send({
      existingUser
    })
  });

export { router as signinRouter }; 
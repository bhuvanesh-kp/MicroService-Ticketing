import express from "express";
import 'express-async-errors';
import cookieSession from "cookie-session";

import { json } from "body-parser";
import { currentUserRouter } from "./Routes/current-user";
import { signinRouter } from "./Routes/signin";
import { signoutRouter } from "./Routes/signout";
import { signupRoute } from "./Routes/signup";
import { errorHandler, NotFoundError } from "@my-micro-service/common";

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));


app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRoute);
app.use("*", async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
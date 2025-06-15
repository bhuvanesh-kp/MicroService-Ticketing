import express from "express";
import 'express-async-errors';
import cookieSession from "cookie-session";
import { createChargeRouter } from "./routes/new";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@my-micro-service/common";

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);
app.use(createChargeRouter);

app.use("*", async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
import express from "express";
import 'express-async-errors';
import cookieSession from "cookie-session";

import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@my-micro-service/common";
import { deleteOrderRouter } from "./routes/delete";
import { showOrderRouter } from "./routes/show";
import { newOrderRouter } from "./routes/new";
import { indexOrderRouter } from "./routes";

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);

app.use("*", async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
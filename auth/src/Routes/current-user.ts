import express from "express";
import { currentUser } from "@my-micro-service/common"; 

const router = express.Router();

router.post("/api/users/currentuser", currentUser, (req, res) => {
  res.send({
    currentUser: req.currentUser || null
  })
});

export { router as currentUserRouter }; 
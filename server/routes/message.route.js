import express from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

export const router = express.Router();

router.get("/:id", userAuth, getMessages);
router.post("/send/:id", userAuth, sendMessage)

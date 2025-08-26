import express from "express";
import {registerUser, verifyEmail, loginUser, logoutUser, forgotPassword, resetPassword, updateProfilePic, checkAuth, userData} from "../controllers/auth.controller.js";
import {userModel} from "../models/user.model.js";
import { userAuth } from "../middlewares/auth.middleware.js";

export const router = express.Router();

router.get("/users", userAuth, async(req, res) => {
    try {
        const {loginId} = req.body;
        const users = await userModel.find({_id: {$ne: loginId}}).select("-password")
        res.status(200).json({success: true, users})
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    } 
});

router.get("/userData",userAuth, userData)
router.get("/checkAuth",userAuth, checkAuth)
router.post("/register" , registerUser);
router.post("/verifyEmail" ,userAuth , verifyEmail);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",userAuth, resetPassword);
router.put("/update-profilepic",userAuth, updateProfilePic);
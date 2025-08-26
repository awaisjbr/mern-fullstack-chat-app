import {userModel} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {transporter} from "../config/nodemail.js"
import cookieParser from "cookie-parser";
import cloudinary from "../config/cloudinary.js";
import corn from "node-cron";

corn.schedule("*/30 * * * *", async () => {
    try {
      const now = new Date();
      const result = await userModel.deleteMany({ isVerified: false, verificationOtpExpiresAt: { $lt: now } });
  
      console.log(`Cron Job: Deleted ${result.deletedCount} unverified users at ${now}`);
    } catch (error) {
      console.error("Cron Job Error:", error.message);
    }
  });

export const registerUser = async (req, res) => {
    const {userName, email, password} = req.body;
    if(!userName || !email || !password){
        return res.json({success:false, message: "All feilds are required"})
    }
    if(password.length < 6){
        return res.status(500).json({success: false, message: "Password should be 6 charters"})
    }

   try {
    const userExist = await userModel.findOne({email});
    if(userExist){
        return res.status(500).json({success:false, message: "User email already exists"})
    }

    const hasedPassword = await bcrypt.hash(password, 10);
    const verificationOTP = Math.floor(Math.random() * 900000 + 100000).toString();
    const verificationOtpExpiresAt = Date.now() + 10 * 60 * 1000   //OTP valid for 10 minutes
    const newUser = new userModel({userName, email, password:hasedPassword, verificationOTP,verificationOtpExpiresAt});
    const token = jwt.sign({userId: newUser._id}, process.env.SECRET_KEY, {expiresIn: "1h"})
    newUser.profilePic = `https://avatar.iran.liara.run/public/boy?username=${newUser.userName}`
    await newUser.save();

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to : "awaisjbr@gmail.com",
        subject: "Account Activation",
        text: `Welcome! your account has been created with email id: ${email}. Please verify your account with otp ${verificationOTP}. It is valid for 10 minutes. `
    }
    await transporter.sendMail(mailOptions);

    res.cookie("token", token, {
        httpOnly: true,
        ecure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({success: true, message: "User register successfully, OTP sent to email"})
   } catch (error) {
    res.status(500).json({success: false, message: error.message})
}
}

export const verifyEmail = async (req, res) => {
    const {loginId, verificationOTP} = req.body;
    try {
        const user = await userModel.findById(loginId).select("-password");
        if(!user){
           return res.status(500).json({success: false, message: "user not authorized"});
        }
        if(user.verificationOTP !== verificationOTP || user.verificationOtpExpiresAt < Date.now()){
            return res.status(500).json({success: false, message: "Invalid or expired OTP"});
        }
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOtpExpiresAt = undefined;
        await user.save();
        res.clearCookie("token",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        
        res.status(200).json({success: true, message: "Account verified successfully.", user:user.isVerified})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }

}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(500).json({success: false, message: "Missing user credentials"})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(500).json({success: false, message: "invalid Email"})
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if(!isMatchPassword){
            return res.status(500).json({success: false, message: "Wrong password"})
        }

        const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn: "12h"});
        res.cookie("token", token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        user.lastLoggedIn = Date.now();
        await user.save();
       
        res.status(200).json({success: true, message: "user loggedIn successfully",user: {...user._doc, password:undefined}})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const userData = async (req, res) => {
    try {
        const {loginId} = req.body;
        const user = await userModel.findById(loginId).select("-password");
        res.status(200).json({success: true, user});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        return res.status(200).json({success: true, message: "user logged out successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const checkAuth = async (req, res) => {
    try {
        const {loginId} = req.body;
        const user = await userModel.findById(loginId).select("-password");
        if(!user){
            return res.status(500).json({success: false, message: "user not authorized"});
        }
        return res.status(200).json({success: true, user});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await userModel.findOne({email}).select("-password");
        if(!user){
            return res.status(500).json({success: false, message: "Email not found"});
        };
        const otp = Math.floor(Math.random() * 900000 + 100000).toString();
        user.verificationOTP = otp
        user.verificationOtpExpiresAt = Date.now() + 10 * 60 * 1000  //OTP valid for 10 minutes
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1h"});
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to : "awaisjbr@gmail.com",
            subject: "Forgor-Password OTP",
            text: `Welcome! your forgot password otp or email id: ${email} is ${otp}. It is valid for 10 minutes. `
        }
        await transporter.sendMail(mailOptions);
    
        res.cookie("token", token, {
            httpOnly: true,
            ecure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({success: true, message: "Forgot Password OTP Successfully send to email"})

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const resetPassword = async (req, res) => {
    const {loginId, verificationOTP, password} = req.body;
    try {
        const user = await userModel.findById(loginId).select("-password");
        if(!user){
            return res.status(500).json({success: false, message: "user not authorized"});
         };
         if(user.verificationOTP === "" || user.verificationOTP !== verificationOTP || user.verificationOtpExpiresAt < Date.now()){
            return res.status(500).json({success: false, message: "Invalid or expired OTP"});
         };
         const hasedPassword = await bcrypt.hash(password, 10);
         user.password = hasedPassword;
         user.verificationOTP = undefined;
         user.verificationOtpExpiresAt = undefined;
         await user.save();
         res.clearCookie("token",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
         res.status(200).json({success: true, message: "Password has been changed successfully."})

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const updateProfilePic = async (req, res) => {
    const {loginId, profilePic} = req.body;
    try {
        if (!profilePic) {
            return res.status(400).json({success: false, message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            loginId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
          );
        res.status(200).json({success: true, message: "Profile pic changed successfully.", updatedUser})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}
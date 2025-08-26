import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        require: true,
        trim: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        // select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationOTP: {
        type: String,
    },
    verificationOtpExpiresAt: {
        type: Date,
    },
    lastLoggedIn:{
        type:Date,
    },
    profilePic: {
        type: String,
        default: ""
    }
},{timestamps: true});


export const userModel = mongoose.model("User", userSchema);
import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailTrap/emails.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
    const {email, password, name} = req.body;
    try {
        if (!email||!password || !name) {
            throw new Error("All fields are required")
        }   

        const userAlreadyExists = await User.findOne({email})
        if (userAlreadyExists) {
            throw new Error("User already exists")
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken =Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt : Date.now() + 24*60*60*1000//24 hours
            
        })
        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success:true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            },
        });

    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        });
        if (!user) {
            throw new Error("Invalid or expired verification code")
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({success : true,
            message: "Email verified successfully",
            user:{
                ...user._doc,
                password: undefined
            }
            });
    } catch (error) {
        console.log("eror in verifyEmail", error);
        res.status(500).json({message: error.message})
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            throw new Error("All fields are required")
        }
        const user = await User.findOne({email});
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials")
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = Date.now();
        await user.save();
        res.status(200).json({
            success:true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }   
    
};
export const logout = async (req, res) => { 
    res.clearCookie("token");
    res.status(200).json({success:true,message:"Logged out successfully"})
};

export const forgortPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            throw new Error("User not found")
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({success:true, message: "Password reset link sent to your email"})
    } catch (error) {
        console.log("error in forgotPassword", error);
        res.status(400).json({message: error.message});
    }
};

export const resetPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        });
        if (!user) {
            throw new Error("Invalid or expired reset token")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        await sendResetSuccessEmail(user.email);
        res.status(200).json({success:true, message: "Password reset successfully"})
    } catch (error) {
        console.log("error in resetPassword", error);
        res.status(400).json({message: error.message});
    }  
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


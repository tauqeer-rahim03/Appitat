const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newUser = new User({
            name: username,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationCode,
            verificationCodeExpiry
        });
        await newUser.save();

        const { sendSignupVerificationEmail } = require("../utils/emailService");
        await sendSignupVerificationEmail(email, verificationCode);

        res.status(201).json({ message: "Verification code sent", email, unverified: true });
    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            const verificationCode = crypto.randomInt(100000, 999999).toString();
            user.verificationCode = verificationCode;
            user.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            const { sendSignupVerificationEmail } = require("../utils/emailService");
            await sendSignupVerificationEmail(email, verificationCode);

            return res.status(403).json({ 
                message: "Please verify your email", 
                unverified: true, 
                email: user.email 
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const userData = user.toObject();
        delete userData.password;

        res.json({ token, user: userData });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Error logging in" });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email and code are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email." });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified." });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        if (new Date() > user.verificationCodeExpiry) {
            return res.status(400).json({ message: "Verification code has expired. Please log in to request a new one." });
        }

        // Mark as verified
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ message: "Email verified successfully.", token, user: userData });
    } catch (error) {
        console.error("VERIFY EMAIL ERROR:", error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                googleId,
                profilePic: picture,
            });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = googleId;
            if (!user.profilePic) user.profilePic = picture;
            await user.save();
        }

        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ token: authToken, user: userData });
    } catch (error) {
        console.error("GOOGLE AUTH ERROR:", error);
        res.status(401).json({ message: "Invalid Google Token", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Return success even if no user found to prevent email enumeration
            return res.status(200).json({ message: "If an account with that email exists, a reset code has been sent." });
        }

        if (user.googleId && !user.password) {
            return res.status(400).json({ message: "This account uses Google Sign-In. Please log in with Google." });
        }

        // Generate a 6-digit numeric code
        const resetCode = crypto.randomInt(100000, 999999).toString();
        user.resetCode = resetCode;
        user.resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        const { sendResetCodeEmail } = require("../utils/emailService");
        await sendResetCodeEmail(email, resetCode);

        res.status(200).json({ message: "If an account with that email exists, a reset code has been sent." });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const user = await User.findOne({ email });
        if (!user || !user.resetCode || !user.resetCodeExpiry) {
            return res.status(400).json({ message: "Invalid or expired reset code." });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({ message: "Invalid reset code." });
        }

        if (new Date() > user.resetCodeExpiry) {
            user.resetCode = undefined;
            user.resetCodeExpiry = undefined;
            await user.save();
            return res.status(400).json({ message: "Reset code has expired. Please request a new one." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetCode = undefined;
        user.resetCodeExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully. You can now log in." });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

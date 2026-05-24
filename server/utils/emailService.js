const nodemailer = require("nodemailer");

const createTransporter = () => {
    // Check if credentials are provided, if not, we'll log a warning and return null
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        console.warn("[Email Service] Missing EMAIL_USER or EMAIL_APP_PASSWORD in .env file. Falling back to console logging.");
        return null;
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
};

const sendResetCodeEmail = async (toEmail, code) => {
    const transporter = createTransporter();

    if (!transporter) {
        // Fallback for local development if credentials aren't set
        console.log(`\n======================================`);
        console.log(`[PASSWORD RESET] Code for ${toEmail}: ${code}`);
        console.log(`======================================\n`);
        return true; 
    }

    const mailOptions = {
        from: `"Appitat Kitchen" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your Appitat Password Reset Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #fcf9f2; border-radius: 12px; border: 1px solid #e2ddd1;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #4a4138; margin-bottom: 5px; font-size: 28px;">Appitat</h1>
                    <p style="color: #6d6153; margin-top: 0; font-size: 16px;">Password Reset Request</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                    <p style="font-size: 16px; margin-bottom: 25px;">You requested a password reset. Here is your 6-digit verification code:</p>
                    
                    <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f5824a; background-color: #fff6ef; padding: 20px; border-radius: 8px; display: inline-block; margin-bottom: 25px;">
                        ${code}
                    </div>
                    
                    <p style="font-size: 14px; color: #6d6153; margin-bottom: 0;">This code will expire in <strong>10 minutes</strong>.</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p>&copy; ${new Date().getFullYear()} Appitat. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Reset code sent successfully to ${toEmail}`);
        return true;
    } catch (error) {
        console.error("[Email Service] Error sending email:", error);
        throw new Error("Failed to send verification email. Please try again later.");
    }
};

const sendSignupVerificationEmail = async (toEmail, code) => {
    const transporter = createTransporter();

    if (!transporter) {
        // Fallback for local development if credentials aren't set
        console.log(`\n======================================`);
        console.log(`[SIGNUP VERIFICATION] Code for ${toEmail}: ${code}`);
        console.log(`======================================\n`);
        return true; 
    }

    const mailOptions = {
        from: `"Appitat Kitchen" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Welcome to Appitat! Verify Your Email",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #fcf9f2; border-radius: 12px; border: 1px solid #e2ddd1;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #4a4138; margin-bottom: 5px; font-size: 28px;">Appitat</h1>
                    <p style="color: #6d6153; margin-top: 0; font-size: 16px;">Welcome to the kitchen!</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                    <p style="font-size: 16px; margin-bottom: 25px;">Thanks for signing up! Please verify your email address by entering the following 6-digit code:</p>
                    
                    <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f5824a; background-color: #fff6ef; padding: 20px; border-radius: 8px; display: inline-block; margin-bottom: 25px;">
                        ${code}
                    </div>
                    
                    <p style="font-size: 14px; color: #6d6153; margin-bottom: 0;">This code will expire in <strong>10 minutes</strong>.</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p>&copy; ${new Date().getFullYear()} Appitat. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Signup verification code sent successfully to ${toEmail}`);
        return true;
    } catch (error) {
        console.error("[Email Service] Error sending email:", error);
        throw new Error("Failed to send verification email. Please try again later.");
    }
};

const sendFeedbackNotification = async ({ userName, userEmail, rating, categories, message }) => {
    const transporter = createTransporter();

    const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);
    const categoryBadges = categories && categories.length > 0
        ? categories.map(c => `<span style="display:inline-block;background:#fff6ef;color:#a03a13;border:1px solid #f5824a44;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:bold;margin:2px 3px;">${c}</span>`).join("")
        : `<span style="color:#999;font-size:13px;">None selected</span>`;

    const formattedDate = new Date().toLocaleString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });

    if (!transporter) {
        console.log(`\n====== NEW FEEDBACK ======`);
        console.log(`From: ${userName} (${userEmail || "anonymous"})`);
        console.log(`Rating: ${rating}/5`);
        console.log(`Categories: ${categories?.join(", ") || "none"}`);
        console.log(`Message: ${message || "(no message)"}`);
        console.log(`==========================\n`);
        return true;
    }

    const mailOptions = {
        from: `"Appitat Feedback" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // sends to your own inbox
        replyTo: userEmail || process.env.EMAIL_USER,
        subject: `📬 New Feedback on Appitat — ${stars} (${rating}/5)`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #fcf9f2; border-radius: 12px; border: 1px solid #e2ddd1;">
                
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #4a4138; margin-bottom: 4px; font-size: 26px;">Appitat</h1>
                    <p style="color: #6d6153; margin-top: 0; font-size: 15px;">New User Feedback Received</p>
                </div>

                <div style="background:#ffffff; border-radius: 10px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 16px;">
                    
                    <div style="text-align:center; margin-bottom: 20px;">
                        <div style="font-size: 32px; letter-spacing: 4px; margin-bottom: 6px;">${stars}</div>
                        <div style="font-size: 28px; font-weight: bold; color: #a03a13;">${rating} / 5</div>
                    </div>

                    <table style="width:100%; border-collapse:collapse; font-size:14px;">
                        <tr>
                            <td style="padding: 8px 0; color:#6d6153; font-weight:bold; width:110px; vertical-align:top;">From</td>
                            <td style="padding: 8px 0; color:#333;">
                                ${userName || "Anonymous"}
                                ${userEmail ? `<br/><a href="mailto:${userEmail}" style="color:#f5824a; font-size:13px;">${userEmail}</a>` : ""}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color:#6d6153; font-weight:bold; vertical-align:top;">Categories</td>
                            <td style="padding: 8px 0;">${categoryBadges}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color:#6d6153; font-weight:bold; vertical-align:top;">Message</td>
                            <td style="padding: 8px 0; color:#333; line-height:1.6;">
                                ${message
                                    ? `<div style="background:#fcf9f2; border-left: 3px solid #f5824a; padding: 10px 14px; border-radius: 4px; font-style:italic;">"${message}"</div>`
                                    : `<span style="color:#999; font-size:13px;">No message provided</span>`
                                }
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color:#6d6153; font-weight:bold;">Submitted</td>
                            <td style="padding: 8px 0; color:#999; font-size:13px;">${formattedDate}</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center; font-size: 12px; color: #bbb; margin-top: 16px;">
                    <p>© ${new Date().getFullYear()} Appitat · This notification was sent to you as the app owner.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Feedback notification sent successfully.`);
        return true;
    } catch (error) {
        console.error("[Email Service] Error sending feedback notification:", error);
        throw new Error("Failed to send feedback notification email.");
    }
};

module.exports = { sendResetCodeEmail, sendSignupVerificationEmail, sendFeedbackNotification };

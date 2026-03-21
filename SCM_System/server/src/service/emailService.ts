import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const requiredSmtpEnv = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] as const;

const getMissingSmtpEnv = () =>
    requiredSmtpEnv.filter((key) => !process.env[key]);

const createTransporter = async () => {
    const missingEnv = getMissingSmtpEnv();

    if (missingEnv.length > 0) {
        throw new Error(`SMTP is not configured. Missing: ${missingEnv.join(', ')}`);
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.verify();
    return transporter;
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: `"SCM System" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: 'Welcome to SCM - Your Journey Starts Here!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 60px 40px; text-align: center; color: white; }
                        .logo { background: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-weight: 800; font-size: 24px; border: 1px solid rgba(255,255,255,0.3); line-height: 64px; }
                        .content { padding: 40px; color: #334155; }
                        .title { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
                        .text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #64748b; }
                        .steps { background-color: #f8fafc; border-radius: 16px; padding: 25px; margin-bottom: 30px; }
                        .step { display: flex; align-items: center; margin-bottom: 15px; }
                        .step-icon { width: 32px; height: 32px; background: #dbeafe; color: #2563eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-right: 15px; flex-shrink: 0; line-height: 32px; }
                        .step-text { font-weight: 600; color: #475569; font-size: 14px; }
                        .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; }
                        .footer { padding: 30px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">SCM</div>
                            <div style="font-size: 14px; font-weight: 600; opacity: 0.8; text-transform: uppercase; letter-spacing: 2px;">Welcome to the next level</div>
                        </div>
                        <div class="content">
                            <h1 class="title">Hey ${name}, we're glad you're here!</h1>
                            <p class="text">Your account is active and ready. The Student Complaint Management system is built to ensure your voice is heard and handled with the highest priority.</p>
                            <div class="steps">
                                <div class="step">
                                    <div class="step-icon">1</div>
                                    <div class="step-text">Submit complaints in seconds</div>
                                </div>
                                <div class="step">
                                    <div class="step-icon">2</div>
                                    <div class="step-text">Track resolution in real-time</div>
                                </div>
                                <div class="step">
                                    <div class="step-icon">3</div>
                                    <div class="step-text">Direct communication with admins</div>
                                </div>
                            </div>
                            <div style="text-align: center;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="btn">Explore My Dashboard</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>&copy; 2026 Student Complaint Management System</p>
                            <p>Built for students, by the administration.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', {
            messageId: info.messageId,
            recipient: email,
            response: info.response,
        });

        return true;
    } catch (error: any) {
        console.error('CRITICAL ERROR: sendWelcomeEmail failed');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.code) console.error('Error Code:', error.code);
        if (error.command) console.error('SMTP Command:', error.command);
        throw error;
    }
};

export const sendPasswordResetEmail = async (email: string, name: string, resetLink: string) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: `"SCM System Support" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: 'Reset Your SCM Password',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 60px 40px; text-align: center; color: white; }
                        .logo { background: rgba(255,255,255,0.1); width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-weight: 800; font-size: 24px; border: 1px solid rgba(255,255,255,0.2); line-height: 64px; }
                        .content { padding: 40px; color: #334155; }
                        .title { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 20px; text-align: center; }
                        .text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #64748b; text-align: center; }
                        .btn { display: inline-block; background-color: #3b82f6; color: #ffffff !important; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; }
                        .footer { padding: 30px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
                        .warning { font-size: 13px; color: #94a3b8; text-align: center; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">SCM</div>
                            <div style="font-size: 14px; font-weight: 600; opacity: 0.8; text-transform: uppercase; letter-spacing: 2px;">Account Security</div>
                        </div>
                        <div class="content">
                            <h1 class="title">Password Reset Request</h1>
                            <p class="text">Hello ${name},<br><br>We received a request to reset your password for the Student Complaint Management system. Click the button below to choose a new password. This link is only valid for 15 minutes.</p>
                            <div style="text-align: center;">
                                <a href="${resetLink}" class="btn">Reset My Password</a>
                                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">This link is expired after 5 minutes.</p>
                            </div>
                            <p class="warning">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2026 Student Complaint Management System</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', {
            messageId: info.messageId,
            recipient: email,
            response: info.response,
        });

        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using environment variables
// If variables are missing, it will use a test account (ethereal.email)
const createTransporter = async () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback for development: Ethereal Email
        console.log('Using Ethereal Email for development...');
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: `"Student Complaint System" <${process.env.EMAIL_FROM || 'no-reply@scm.edu'}>`,
            to: email,
            subject: 'Welcome to the Student Complaint Management System!',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="background-color: #2563eb; color: white; width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; line-height: 60px;">
                            SCM
                        </div>
                    </div>
                    <h1 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome aboard, ${name}!</h1>
                    <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">
                        We're excited to have you join the Student Complaint Management System. Your account has been successfully created, and you can now start using our platform to voice your concerns and track their resolution.
                    </p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                        <h2 style="color: #1e293b; font-size: 16px; font-weight: 700; margin-bottom: 12px;">Getting Started:</h2>
                        <ul style="color: #64748b; padding-left: 20px;">
                            <li>Log in to your dashboard to view active complaints.</li>
                            <li>Submit a new complaint using the simple form.</li>
                            <li>Track real-time updates as administrators address your issues.</li>
                        </ul>
                    </div>
                    <a href="http://localhost:5173/login" style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
                        Go to Dashboard
                    </a>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                        &copy; 2026 Student Complaint System. All rights reserved.<br/>
                        This is an automated message, please do not reply.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        // Preview URL only available when sending through an Ethereal account
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Initialize nodemailer transporter
        this.transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587, // Port for your SMTP server (587 for TLS)
            secure: false, // TLS requires secureConnection to be false
            auth: {
                user: 'palletsplus2024@outlook.com',
                pass: 'Farooha1234',
            },
        });
    }

    async sendResetPasswordEmail(email: string, resetPasswordLink: string): Promise<{ message: string }> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: 'PalletsPlus <palletsplus2024@outlook.com>',
            to: email,
            subject: 'Password Reset Request',
            text: `Please click the following link to reset your password: ${resetPasswordLink}`,
            };
    
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ', info);
    
            return { message: 'Reset password email sent successfully' };
        } catch (error) {
            console.error('Error sending email: ', error);
            throw new Error('Failed to send reset password email');
        }
    }
    
    async sendRegistrationEmail(email: string, verificationLink: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: 'PalletsPlus <palletsplus2024@outlook.com>',
            to: email,
            subject: 'Email Verification',
            text: `Please click the following link to verify your email address: ${verificationLink}`,
        };
    
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ', info);
        } catch (error) {
            console.error('Error sending email: ', error);
            throw new Error('Failed to send verification email');
        }
    }
}

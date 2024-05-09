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

    async sendResetPasswordEmail(email: string, resetPasswordToken: string): Promise<{ message: string; resetPasswordToken: string }> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: 'PalletsPlus <palletsplus2024@outlook.com>',
            to: email,
            subject: 'Password Reset Request',
            text: `Use this token to reset your password: ${resetPasswordToken}`,
        };
    
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ', info);
    
            return { message: 'Reset password email sent successfully', resetPasswordToken };
        } catch (error) {
            console.error('Error sending email: ', error);
            throw new Error('Failed to send reset password email');
        }
    }
}

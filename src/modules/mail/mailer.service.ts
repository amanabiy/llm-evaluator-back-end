import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendUserConfirmation(email: string, token: string) {
    try {
      console.log(`sending email`, email, token)
      // console.log(`path`, await path.join(__dirname, 'templates'))
      await this.mailerService.sendMail({
        // to: email,
        // subject: 'Welcome to Maintenance System! Confirm your Email',
        // template: 'verification',
        // context: {
        //   token,
        // },
        to: email, // list of receivers
        subject: 'Welcome! Confirm your Email', // Subject line
        text: `${token}`, // plaintext body
        // html: `<b>here is your token</b> <br> 
        // <a href="http://localhost:5173/verify-email/${token}">link</a>
        // `, // HTML body content

      });
      console.log(`sent email to ${email} with token ${token}`)
      console.log()
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendOtp(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP for Password Reset',
      // template: './otp',
      // context: {
      //   otp,
      // },
      text: `${otp}`, // plaintext body
      html: `<b>Here is your otp: ${otp}</b>`,
    });
  }
}


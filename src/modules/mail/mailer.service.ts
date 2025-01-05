import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendUserConfirmation(email: string, token: string) {
    try {
      console.log(`sending email`, email, token)
      await this.mailerService.sendMail({
        to: email, // list of receivers
        subject: 'Welcome! Confirm your Email', // Subject line
        text: `${token}`, // plaintext body
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
      text: `${otp}`, // plaintext body
      html: `<b>Here is your otp: ${otp}</b>`,
    });
  }
}


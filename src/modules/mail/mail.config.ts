import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailConfig: MailerOptions = {
  transport: {
    host: process.env.MAIL_HOST || 'localhost',  // Default to localhost
    port: parseInt(process.env.MAIL_PORT, 10) || 1025,  // Default to MailHog SMTP port (1025)
    secure: false,  // MailHog does not require secure connection
    auth: {
      user: process.env.MAIL_USER || 'sdf',  // Optional: Set a user if needed
      pass: process.env.MAIL_PASS || 'sdf',  // Optional: Set a password if needed
    },
  },
  defaults: {
    from: '"No Reply" <no-reply@example.com>',  // Default 'from' address
  },
  // Optional template configuration
  template: {
    dir: path.join(__dirname, 'templates'),  // Directory where your email templates are stored
    // adapter: new HandlebarsAdapter(),  // Using Handlebars for templating
    options: {
      strict: true,  // Enforce strict mode for Handlebars templates
    },
  },
};

console.log(mailConfig);  // Optional: To inspect the configuration

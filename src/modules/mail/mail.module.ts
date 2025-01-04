import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from './mail.config';
import { MailService } from './mailer.service';

@Module({
  imports: [
    MailerModule.forRoot(mailConfig),
  ],
  providers: [ MailService ],
  exports: [ MailService ],
})
export class MailModule {}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailService } from '@sendgrid/mail';

@Injectable()
export class MailServices {
  constructor(private configService: ConfigService) {}

  async sendMail(to: string, subject: string, body: string, html?: string) {
    const ms = new MailService();
    ms.setApiKey(this.configService.getOrThrow('sendGrid'));
    ms.send({
      to,
      from: this.configService.getOrThrow('mail'),
      subject,
      text: body,
      html,
    })
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

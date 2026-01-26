import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Bienvenido a la plataforma',
      template: './welcome', // templates/welcome.hbs
      context: {
        name,
      },
    });
  }

  async sendSimpleEmail(to: string, message: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Mensaje importante',
      text: message,
    });
  }
}

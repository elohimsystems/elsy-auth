import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path/win32';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mail.elohimsystems.com',
        port: 465,
        secure: true,
        auth: {
          user: 'notificacion@elohimsystems.com',
          pass: 'v1g7MZq0I9~KcVtD',
        },
      },
      defaults: {
        from: '"ELSY-Auth" <notificacion@elohimsystems.com>',
      },
      // template: {
      //   dir: join(__dirname, 'templates'),
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
  exports: [MailModule],
})
export class MailModule {}

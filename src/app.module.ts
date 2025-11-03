import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TextModule } from './text/text.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    PrismaModule,
    TextModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'danilbashirov0@gmail.com',
          pass: 'lptb oatd bnyk efhr',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

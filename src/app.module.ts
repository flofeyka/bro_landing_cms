import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TextModule } from './text/text.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, TextModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

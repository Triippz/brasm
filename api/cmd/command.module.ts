import { Module } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import {
  CreateSuperUserCommand,
  CreateSuperUserQuestions,
} from './commands/create-super-user';
import { UserService } from '../src/users/user.service';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  ChangeUserPassword,
  ChangeUserPasswordQuestions,
} from './commands/change-user-password';

@Module({
  imports: [],
  providers: [
    CreateSuperUserCommand,
    CreateSuperUserQuestions,
    ChangeUserPassword,
    ChangeUserPasswordQuestions,
    UserService,
    PrismaService,
  ],
})
export class CommandModule {}

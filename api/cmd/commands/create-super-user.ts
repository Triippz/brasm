import {
  Command,
  CommandRunner,
  InquirerService,
  Question,
  QuestionSet,
  ValidateFor,
} from 'nest-commander';
import { CreateUserDto } from '../../src/users/dtos/create-user.dto';
import { UserRole } from '@prisma/client';
import { UserService } from '../../src/users/user.service';
import { Logger } from '@nestjs/common';

@Command({
  name: 'create-super-user',
  description: 'Creates a new super user in the app with the ADMIN role',
})
export class CreateSuperUserCommand extends CommandRunner {
  logger = new Logger(CreateSuperUserCommand.name);

  constructor(
    private readonly inquirer: InquirerService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    this.logger.log('Creating a new super user...');
    const answers = await this.inquirer.ask<{
      username: string;
      email: string;
      password: string;
    }>('create-super-user-questions', undefined);

    await this.createUser(answers);
  }

  async createUser(answers: {
    username: string;
    email: string;
    password: string;
  }) {
    const createUserDto = {
      username: answers.username,
      email: answers.email,
      password: answers.password,
      role: UserRole.ADMIN,
    } as CreateUserDto;

    try {
      await this.userService.create(createUserDto);

      this.logger.log('User created successfully!');
    } catch (error) {
      this.logger.error(error);
    }
  }
}

@QuestionSet({
  name: 'create-super-user-questions',
})
export class CreateSuperUserQuestions {
  @Question({
    message: 'What is the username?',
    name: 'username',
  })
  parseUsername(username: string): string {
    return username;
  }

  @Question({
    message: 'What is the email?',
    name: 'email',
  })
  parseEmail(email: string): string {
    return email;
  }

  @ValidateFor({
    name: 'email',
  })
  validateEmail(email: string): boolean | string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      return true;
    }

    return 'Please enter a valid email';
  }

  @Question({
    message: 'What is the password?',
    name: 'password',
    type: 'password',
  })
  parsePassword(password: string): string {
    return password;
  }

  @ValidateFor({
    name: 'password',
  })
  validatePassword(password: string): boolean | string {
    if (password.length >= 8) {
      return true;
    }

    return 'Please enter a password with at least 8 characters';
  }
}

import {
  Command,
  CommandRunner,
  InquirerService,
  Question,
  QuestionSet,
  ValidateFor,
} from 'nest-commander';
import { UserService } from '../../src/users/user.service';
import { Logger } from '@nestjs/common';

@Command({
  name: 'change-password',
  description: "Changes a user's password",
})
export class ChangeUserPassword extends CommandRunner {
  logger = new Logger(ChangeUserPassword.name);

  constructor(
    private readonly inquirer: InquirerService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const answers = await this.inquirer.ask<{
      username: string;
      password: string;
      passwordConfirmation: string;
    }>('change-user-password-questions', undefined);

    await this.createUser(answers);
  }

  async createUser(answers: {
    username: string;
    passwordConfirmation: string;
    password: string;
  }) {
    if (answers.password !== answers.passwordConfirmation) {
      throw new Error('Passwords do not match');
    }

    const user = await this.userService.findByUsername(answers.username);

    if (!user) {
      this.logger.error(`User ${answers.username} not found`);
      throw new Error(`User ${answers.username} not found`);
    }

    await this.userService.cliChangePassword(user.id, answers.password);

    this.logger.log('User created successfully!');
  }
}

@QuestionSet({
  name: 'change-user-password-questions',
})
export class ChangeUserPasswordQuestions {
  @Question({
    message: 'What is the username of the user?',
    name: 'username',
  })
  parseUsername(username: string): string {
    return username;
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

  @Question({
    message: 'Please confirm the password',
    name: 'passwordConfirmation',
    type: 'password',
  })
  parsePasswordConfirmation(passwordConfirmation: string): string {
    return passwordConfirmation;
  }

  @ValidateFor({
    name: 'passwordConfirmation',
  })
  validatePasswordConfirmation(passwordConfirmation: string): boolean | string {
    if (passwordConfirmation.length >= 8) {
      return true;
    }

    return 'Please enter a password with at least 8 characters';
  }
}

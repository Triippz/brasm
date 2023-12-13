import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dtos/create-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto): Promise<UserResponseDto> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const maybeUser = await this.prisma.user.create({
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        role: UserRole.USER,
      },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async changePassword(
    id: number,
    pwdChangeRequest: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    // CHeck if old password is correct
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(
      pwdChangeRequest.oldPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new Error('Old password is incorrect');
    }

    // Update password
    const maybeUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: await bcrypt.hash(pwdChangeRequest.newPassword, 10),
      },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<UserResponseDto> {
    const maybeUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async updateRole(id: number, role: UserRole): Promise<UserResponseDto> {
    const maybeUser = await this.prisma.user.update({
      where: { id },
      data: {
        role,
      },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => plainToInstance(UserResponseDto, user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const maybeUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async findByUsername(username: string): Promise<UserResponseDto | undefined> {
    const maybeUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!maybeUser) {
      return undefined;
    }

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async cliChangePassword(id: number, password: string): Promise<void> {
    const maybeUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!maybeUser) {
      throw new Error('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        password: await bcrypt.hash(password, 10),
      },
    });
  }
}

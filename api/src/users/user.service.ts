import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertUserDto } from './dtos/upsert-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UpsertUserDto): Promise<UserResponseDto> {
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

  async update(id: number, user: UpsertUserDto): Promise<UserResponseDto> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const maybeUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
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

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}

import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dtos/user-response.dto';
import {AccessTokenDto} from "./dtos/access-token.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService, private jwtService: JwtService) {}

  async login(
    username: string,
    password: string,
  ): Promise<AccessTokenDto> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`No user found for username: ${username}`);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const maybeUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }
}

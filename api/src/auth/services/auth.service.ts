import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { LoginInput } from '../dtos/login-input';
import { User } from '@prisma/client';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
} from '../dtos/auth-token-output.dto';
import { ConfigService } from '@nestjs/config';
import { TokensService } from '../../tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private configService: ConfigService,
    private tokenService: TokensService,
  ) {}

  async login(loginRequest: LoginInput): Promise<AuthTokenOutput> {
    const user = await this.authenticateUser(
      loginRequest.username,
      loginRequest.password,
    );

    return this.getAuthToken(user);
  }

  async authenticateUser(username: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      throw new NotFoundException(`No user found for username: ${username}`);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const maybeUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async getAuthToken(
    user: UserAccessTokenClaims | User,
  ): Promise<AuthTokenOutput> {
    const authTokens = await this.getTokens(user);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        refreshToken: authTokens.refreshToken,
      },
    });

    return plainToInstance(AuthTokenOutput, authTokens, {
      excludeExtraneousValues: true,
    });
  }

  private async getTokens(user: UserAccessTokenClaims | User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    let role;
    if (!(user instanceof UserAccessTokenClaims)) {
      role = user?.role;
    } else {
      role = user?.role;
    }

    const subject = { sub: user.id };
    const payload = {
      email: user.role,
      sub: user.id,
      appRole: role,
    };

    const authToken = {
      refreshToken: this.tokenService.signJwt(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
        secret: this.configService.get('jwt.refreshTokenSecret'),
      }),
      accessToken: this.tokenService.signJwt(
        { ...payload, ...subject },
        {
          expiresIn: this.configService.get('jwt.accessTokenExpiresInSec'),
          secret: this.configService.get('jwt.accessTokenSecret'),
        },
      ),
    };
    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }
}

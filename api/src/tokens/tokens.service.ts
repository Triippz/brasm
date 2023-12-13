import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { async as cryptoRandomString } from 'crypto-random-string';
import { v4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt/dist/interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokensService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  /**
   * Sign a JWT
   * @param payload
   * @param options - Signing options
   */
  signJwt(payload: Buffer | object, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  async signJwtAsync(payload: Buffer | object, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  /**
   * Verify and decode a JWT
   * @param subject - Subject
   * @param token - JWT
   * @param options - Verify options
   */
  verify<T>(subject: string, token: string, options?: JwtVerifyOptions) {
    try {
      return this.jwtService.verify(token, {
        ...options,
        subject,
      }) as any as T;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Decode a JWT without verifying it
   * @param token - JWT
   * @param options - Decode options
   */
  decode<T>(token: string, options?: jwt.DecodeOptions) {
    return this.jwtService.decode(token, options) as T;
  }

  /**
   * Generate a UUID
   */
  generateUuid() {
    return v4();
  }

  /**
   * Generate a cryptographically strong random string
   * @param length - Length of returned string
   * @param charactersOrType - Characters or one of the supported types
   */
  async generateRandomString(
    length = 32,
    charactersOrType = 'alphanumeric',
  ): Promise<string> {
    if (
      [
        'hex',
        'base64',
        'url-safe',
        'numeric',
        'distinguishable',
        'ascii-printable',
        'alphanumeric',
      ].includes(charactersOrType)
    )
      return cryptoRandomString({
        length,
        type: charactersOrType as
          | 'hex'
          | 'base64'
          | 'url-safe'
          | 'numeric'
          | 'distinguishable'
          | 'ascii-printable'
          | 'alphanumeric',
      });
    return cryptoRandomString({
      length,
      characters: charactersOrType,
    });
  }

  parseUserIdFromToken(token: string): number {
    try {
      const base64Payload = token.split('.')[1];
      const payloadBuffer = Buffer.from(base64Payload, 'base64');
      const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
      return updatedJwtPayload.id;
    } catch (error) {
      Logger.warn(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

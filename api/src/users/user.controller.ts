import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AppRoles } from '../auth/decorators/role.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @AppRoles(UserRole.ADMIN, UserRole.USER)
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.ADMIN, UserRole.USER)
  @ApiOkResponse({ type: UserResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.ADMIN, UserRole.USER)
  @ApiCreatedResponse({ type: UserResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AppRoles(UserRole.ADMIN, UserRole.USER)
  @ApiCreatedResponse({ type: UserResponseDto })
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePassword: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    return this.userService.changePassword(id, changePassword);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @AppRoles(UserRole.ADMIN)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.delete(id);
  }
}

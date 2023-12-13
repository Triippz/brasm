import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {UserService} from "./user.service";
import {UserResponseDto} from "./dtos/user-response.dto";
import {UpsertUserDto} from "./dtos/upsert-user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiCreatedResponse({ type: UserResponseDto })
    // TODO: Protect under admin role
    async create(@Body() createUserDto: UpsertUserDto): Promise<UserResponseDto> {
        return this.userService.create(createUserDto)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserResponseDto, isArray: true })
    async findAll(): Promise<UserResponseDto[]> {
        return  this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserResponseDto })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: UserResponseDto })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpsertUserDto,
    ) {
        return this.userService.update(id, updateUserDto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        return this.userService.delete(id)
    }
}

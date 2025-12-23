import {
  Controller,
  Get,
  Req,
  Patch,
  Post,
  Res,
  Put,
  Delete,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from '@services/auth/auth.service';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { compare } from 'bcrypt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async registerUser(@Res() res: Response, @Body() body: RegisterUserDto) {
    const result = await this.userService.createUser(body);
    if (!result) {
      throw new HttpException(
        {
          message: 'User registration failed',
          status: 'error',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('REGISTER RESULT', result);
    return res.send({ status: 'ok', data: { user: result } });
  }

  @Post('/login')
  async loginUser(@Res() res: Response, @Body() body: LoginUserDto) {
    const { loginOrEmail, password } = body;

    const foundUser =
      await this.userService.getUserByLoginOrEmail(loginOrEmail);

    if (!foundUser) {
      throw new HttpException(
        {
          message: 'User not found',
          status: 'error',
          statusCode: HttpStatus.FORBIDDEN,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const isPasswordMatch = await compare(password, foundUser.password);
    if (!isPasswordMatch) {
      throw new HttpException(
        {
          message: 'Invalid password',
          status: 'error',
          statusCode: HttpStatus.FORBIDDEN,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const jwt = await this.authService.setSession({ userId: foundUser.id });
    return res.send({ status: 'ok', data: { accessToken: jwt } });
  }

  @Get('/id/:id')
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const userData = await this.userService.getUserById(id);
    return res.send({ status: 'ok', data: { userData } });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    const users = await this.userService.getAllUsers();
    return res.send({ status: 'ok', data: users });
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  async createUser(@Req() req: Request, @Res() res: Response) {
    await this.userService.createUser(req.body);
    return res.send({ status: 'ok' });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    await this.userService.updateUserData(id, body);
    return res.send({ status: 'ok' });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.userService.deleteUser(id);
    return res.send({ status: 'ok' });
  }
}

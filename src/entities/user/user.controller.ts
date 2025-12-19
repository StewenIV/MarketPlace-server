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
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { compare } from 'bcrypt';
import { stat } from 'fs';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/')
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    const users = await this.userService.getAllUsers();
    return res.send({ status: 'ok', data: users });
  }

  @Post('/register')
  async registerUser(@Res() res: Response, @Body() body: RegisterUserDto) {
    console.log('BODY', body);
    const result = await this.userService.createUser(body);
    console.log('RESULT', result);
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
    return res.send({ status: 'ok' });
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

    const jwt = this.jwtService.sign({ x: 1 },
      { secret: 'sadas', expiresIn: '1h' }
    );

    return res.send({ status: 'ok', data: { accessToken: jwt } });
  }

  @Get('/id/:id')
  async getUsers(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const userData = await this.userService.getUserById(id);
    return res.send({ status: 'ok', data: { userData } });
  }

  @Post('/')
  @UseInterceptors(FileInterceptor(''))
  async createUser(@Req() req: Request, @Res() res: Response) {
    await this.userService.createUser(req.body);
    return res.send({ status: 'ok' });
  }

  @Put('/:id')
  async updateUser(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    await this.userService.updateUserData(id, body);
    return res.send({ status: 'ok' });
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.userService.deleteUser(id);
    return res.send({ status: 'ok' });
  }
}

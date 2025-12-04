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
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/') 
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    const users = await this.userService.getAllUsers();
    return res.send({ status: 'ok', data: users });
  }

  @Get('/:id')
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
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.userService.deleteUser(id);
    return res.send({ status: 'ok' });
  }
}

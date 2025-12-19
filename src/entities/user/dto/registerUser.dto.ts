import { IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  nameFirst: string;
  @IsString()
  nameLast: string;
  @IsString()
  login: string;

  @IsString()
  phone: string;

  password: string;
  passwordConfirm: string;
}

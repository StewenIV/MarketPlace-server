import { E_Gender } from '../types';
import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  nameFirst: string;

  @MinLength(2)
  @IsString()
  nameLast: string;

  @IsISO8601()
  birthDate: Date;

  @IsEnum(E_Gender)
  @IsNotEmpty()
  gender: E_Gender;
}

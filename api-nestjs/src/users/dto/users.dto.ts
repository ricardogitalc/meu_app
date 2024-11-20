import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/)
  whatsappNumber?: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase().trim())
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/)
  whatsappNumber?: string;
}

import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  @IsEmail({}, { message: 'O e-mail informado não é válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Primeiro nome do usuário',
    example: 'Nome',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Sobrenome',
  })
  @IsString({ message: 'O sobrenome deve ser uma string' })
  @IsNotEmpty({ message: 'O sobrenome é obrigatório' })
  @MinLength(2, { message: 'O sobrenome deve ter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'O sobrenome deve ter no máximo 50 caracteres' })
  lastName: string;

  @ApiProperty({
    description: 'Número do WhatsApp',
    required: false,
    example: '11999999999',
  })
  @IsString({ message: 'O número do WhatsApp deve ser uma string' })
  @IsOptional()
  @Matches(/^\d{10,11}$/, {
    message: 'O número do WhatsApp deve ter 10 ou 11 dígitos',
  })
  whatsappNumber?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  @IsEmail({}, { message: 'O e-mail informado não é válido' })
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase().trim())
  email?: string;

  @ApiProperty({
    description: 'Primeiro nome do usuário',
    example: 'Nome',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  firstName?: string;

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Sobrenome',
  })
  @IsString({ message: 'O sobrenome deve ser uma string' })
  @IsNotEmpty({ message: 'O sobrenome é obrigatório' })
  @MinLength(2, { message: 'O sobrenome deve ter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'O sobrenome deve ter no máximo 50 caracteres' })
  lastName?: string;

  @ApiProperty({
    description: 'Número do WhatsApp',
    required: false,
    example: '11999999999',
  })
  @IsString({ message: 'O número do WhatsApp deve ser uma string' })
  @IsOptional()
  @Matches(/^\d{10,11}$/, {
    message: 'O número do WhatsApp deve ter 10 ou 11 dígitos',
  })
  whatsappNumber?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { CONFIG_MESSAGES } from 'src/config/config';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  @IsEmail({}, { message: CONFIG_MESSAGES.InvalidEmail })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;
}

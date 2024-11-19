import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { CONFIG_MESSAGES } from 'src/config/config';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário para envio do magic link',
    example: 'usuario@email.com',
  })
  @IsEmail({}, { message: CONFIG_MESSAGES.InvalidEmail })
  destination: string;
}

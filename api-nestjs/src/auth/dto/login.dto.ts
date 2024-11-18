import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { MESSAGES } from 'src/messages/messages';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário para envio do magic link',
    example: 'usuario@email.com',
  })
  @IsEmail({}, { message: MESSAGES.InvalidEmail })
  destination: string;
}

import { IsEmail } from 'class-validator';
import { MESSAGES } from 'src/messages/messages';

export class LoginDto {
  @IsEmail({}, { message: MESSAGES.InvalidEmail })
  destination: string;
}

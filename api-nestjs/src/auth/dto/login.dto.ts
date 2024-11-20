import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { CONFIG_MESSAGES } from 'src/config/config';

export class LoginDto {
  @IsEmail({}, { message: CONFIG_MESSAGES.InvalidEmail })
  @Transform(({ value }) => value.toLowerCase().trim())
  destination: string;
}

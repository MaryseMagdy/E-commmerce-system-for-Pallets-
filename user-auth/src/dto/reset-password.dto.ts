import { IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;
  constructor(email: string) {
    this.email = email;
  }
}

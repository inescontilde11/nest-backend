import { IsEmail, MinLength, isEmail } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @MinLength(6)
    pwd: string;

}


import { IsArray, IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { Game } from "src/app/entities/game.entity";

export class RegisterUserDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    pwd: string;

    @IsString()
    role: string;

}
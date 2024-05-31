import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsEmail, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGameDto {

    @IsString()
    @MaxLength(50)
    title: string;

    @IsString()
    devname: string;

    @MaxLength(500)
    desc: string;

    @IsArray()
    @ArrayMinSize(1)
    categories: string[]

    shortvideo?: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    imgs: string[]

    releasedate: string;

    @IsString()
    archiveexegame: string;

    tamanyo?: number;
}
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Game } from 'src/app/entities/game.entity';
import { isNull } from 'util';

export class UpdateAuthDto extends PartialType(CreateUserDto) {

    @MinLength(3)
    tfno?: string;

    @MaxLength(500)
    desc?: string;

    @IsString()
    img?: string | null;

    @IsArray()
    games?: Game[] = [];
}

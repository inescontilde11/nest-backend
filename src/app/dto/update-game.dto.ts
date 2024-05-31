import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';

export class UpdateAppDto extends PartialType(CreateGameDto) {}
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './entities/game.entity';
import { Model } from 'mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { GameResponse } from './interfaces/gameResponse.interface';
import { UpdateAppDto } from './dto/update-game.dto';

@Injectable()
export class GameAppService {

  constructor(@InjectModel(Game.name)
    private gameModel: Model<Game>) {
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const currentDate = new Date();
    try {
      const { releasedate, ...gameData } = createGameDto;
      const newGame = new this.gameModel({
        releasedate: currentDate.toString(),
        ...gameData
      });

      await newGame.save();
      const newjsonGame = newGame.toJSON();
      return newjsonGame;
    } catch(error) {
      if(error.code === 11000) {
        throw new BadRequestException(`${createGameDto.title} ya existe!`);
      }
      throw new InternalServerErrorException('Fatal error');
    }
  }

  async uploadGame(gameDto: CreateGameDto): Promise<GameResponse> {
    const game = await this.create(gameDto);
    return {
        game: game
    }
  }

  findAll(): Promise<Game[]> {
    return this.gameModel.find();
  }

  async findGameById(id: string) {
    const game = await this.gameModel.findById(id);
    const gamejson = game.toJSON();
    return gamejson;
  }

  findOne(id: string) {
    const game = this.gameModel.findById(id);
    return game;
  }

  async update(id: string, updateAppDto: UpdateAppDto) {
    try {
      const game = await this.gameModel.findByIdAndUpdate(id, updateAppDto);
      return game;
    } catch(error) {
      if(error.code === 11000) {
        throw new BadRequestException(`${updateAppDto.title} ya existe!`);
      }
      console.log(error);
      throw new InternalServerErrorException('Fatal error');
    }
  }

  async remove(id: string) {
    const gameToBeDeleted = this.gameModel.findById(id);
    await this.gameModel.deleteOne(gameToBeDeleted);

    return 'El juego: ' + gameToBeDeleted + ', ha sido borrado';
  }

}
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Game, GameSchema } from './entities/game.entity';
import { GameAppController } from './game-app.controller';
import { GameAppService } from './game-app.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GameAppController],
  providers: [GameAppService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Game.name,
        schema: GameSchema
      }
    ])
  ]
})
export class GameAppModule {}
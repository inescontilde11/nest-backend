import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GameAppModule } from './app/game-app.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI) ,
    AuthModule,
    GameAppModule],
  controllers: [],
  providers: [],
})
export class AppModule {

  
}

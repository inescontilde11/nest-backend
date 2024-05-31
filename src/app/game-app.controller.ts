import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GameAppService } from './game-app.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateAppDto } from './dto/update-game.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('app')
export class GameAppController {
  constructor(private readonly gameAppService: GameAppService) {}

  @Get()
  findAll() {
    // const user = req['user'];

    return this.gameAppService.findAll();
  }

  @Post('/register-game')
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameAppService.create(createGameDto);
  }

  @Post('/game-page')
  uploadGame( @Body() gameDto: CreateGameDto) {
    return this.gameAppService.uploadGame(gameDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameAppService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto) {
    return this.gameAppService.update(id, updateAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameAppService.remove(id);
  }

  @Post('/upload-exe')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/games',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(' ').join('_')+'_'+Date.now()+'.'+fileExtension;

        cb(null, newFileName);
      }
    }),
    fileFilter : (req, file, cb) => {
      if(!file.originalname.match(/\.(exe|jar)$/)) {
        return cb(null, false);
      }
      cb(null, true);
    }
  }))
  uploadArchive(@UploadedFile() file: Express.Multer.File) {
    if(!file){
        throw new BadRequestException('File is not a .exe or .jar');
    } else {
      const response = {
        filePath: `http://localhost:3000/app/exearchives/${file.filename}`
      }
      return response;
    }
  }

  @Get('exearchives-url/:filename')
  async getUrlGame(@Param('filename') filename, @Res() res: Response) {
    res.send(`http://localhost:3000/app/exearchives/${filename}`);
  }

  @Get('exearchives/:filename')
  async getGame(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, {root: './uploads/games'});
  }
}
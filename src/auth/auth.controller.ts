import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/register')
  register( @Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  login( @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get()
  findAll( @Request() req: Request) {
    // const user = req['user'];

    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'] as User;
    return {user, token: this.authService.getJWT({id: user._id})};
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findUserById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(id, updateAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Post('/upload-archive')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/imgs',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(' ').join('_')+'_'+Date.now()+'.'+fileExtension;

        cb(null, newFileName);
      }
    }),
    fileFilter : (req, file, cb) => {
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(null, false);
      }
      cb(null, true);
    }
  }))
  uploadArchive(@UploadedFile() file: Express.Multer.File) {
    if(!file){
        throw new BadRequestException('File is not an image');
    } else {
      const response = {
        filePath: `http://localhost:3000/auth/pictures/${file.filename}`
      }
      return response;
    }
  }

  @Get('pictures-url/:filename')
  async getUrlImage(@Param('filename') filename, @Res() res: Response) {
    res.send(`http://localhost:3000/auth/pictures/${filename}`);
  }

  @Get('pictures/:filename')
  async getImage(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, {root: './uploads/imgs'});
  }

}

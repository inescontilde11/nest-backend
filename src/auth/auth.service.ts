import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService) {

  }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {
      const { pwd, ...userData } = createUserDto;
      const newUser = new this.userModel({
        pwd: bcryptjs.hashSync( pwd, 10),
        ...userData
      });

      await newUser.save();
      const { pwd:_, ...user} = newUser.toJSON();
      return user;
    } catch(error) {
      if(error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} ya existe!`);
      }
      throw new InternalServerErrorException('Fatal error');
    }
  }


  async register(registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerUserDto);
    return {
      user: user,
      token: this.getJWT({id: user._id})
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    console.log({loginDto});
    const { email, pwd } = loginDto;
    const user = await this.userModel.findOne({email});
    if(!user) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    if(!bcryptjs.compareSync(pwd, user.pwd)) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const {pwd:_, ...rest} = user.toJSON();

    return {
      user: rest,
      token: this.getJWT({id: user.id})
    }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    const {pwd, ...rest} = user.toJSON();
    return rest;
  }

  findOne(id: string) {
    return `This action returns a #${id} auth`;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    try {
      let user: User;
      if(updateAuthDto.pwd) {
        const { pwd, ...userData } = updateAuthDto;
        user = await this.userModel.findByIdAndUpdate(id, {pwd: bcryptjs.hashSync( pwd, 10),
        ...userData});
      } else {
        user = await this.userModel.findByIdAndUpdate(id, updateAuthDto);
      }
      return user;
    } catch(error) {
      if(error.code === 11000) {
        throw new BadRequestException(`${updateAuthDto.email} ya existe!`);
      }
      console.log(error);
      
      throw new InternalServerErrorException('Fatal error');
    }
  }

  async remove(id: string) {
    const userToBeDeleted = this.userModel.findById(id);
    await this.userModel.findByIdAndDelete(id);

    return 'El usuario: ' + userToBeDeleted + ', ha sido borrado';
  }

  getJWT(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}

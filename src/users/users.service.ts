import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}


  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = this.userRepository.create({
      ...createUserDto
    });

    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);

    try { 
      await this.userRepository.save(user);
    }
    catch(e) {
      throw new ConflictException("the email and password should be unique");
    }

    return {
      id: user.id,
      email: user.email,
      FirstName: user.FirstName,
      LastName: user.LastName,
    };

  }

  async login(credentials: LoginCredentialsDto) {
    const {email, password} =  credentials;

    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.email = :email', {email: email})
      .getOne();

    if(!user) {
      throw new NotFoundException('email does not exist in our database');
    }
    else {
      const hashedPassword = bcrypt.hash(password, user.salt);
      
      if(await hashedPassword === user.password) {

        const payload = {
          FirstName: user.FirstName,
          LastName: user.LastName,
          email: user.email,
          role: user.role,
        };

        const jwt = this.jwtService.sign(payload);
        
        return  {
          "access_token": jwt
        } 
      }
      else {
        throw new NotFoundException('incorrect password');
      }
    }

  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

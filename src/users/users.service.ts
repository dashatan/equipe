import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const exist = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (!!exist) throw new HttpException('user already exists', HttpStatus.FORBIDDEN);

    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(createUserDto.password, salt);
      const user = await this.userRepository.save({ ...createUserDto, password });
      const jwt = await this.makeJwt(user);
      return { jwt };
    } catch (error) {
      throw new HttpException('user create error', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userRepository.findOneBy({ email });
    const exception = new HttpException('email or password is not correct', HttpStatus.FORBIDDEN);
    if (!user) throw exception;
    const same = await bcrypt.compare(password, user.password);
    if (!same) throw exception;
    const jwt = await this.makeJwt(user);
    return { jwt };
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(params: { id: ObjectId; token?: string }): Promise<User> {
    const res: any = this.jwtService.decode(params.token);
    console.log('RES====>', params);

    let id = params.id;

    if (res?.sub) id = res.sub;
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new HttpException('user find error', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    try {
      const newUser = await this.userRepository.update(id, updateUserDto);
      return newUser;
    } catch (error) {
      throw new HttpException('user update error', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async remove(id: ObjectId) {
    try {
      await this.userRepository.delete(id);
      return { message: 'user deleted', id };
    } catch (error) {
      throw new HttpException('user delete error', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async makeJwt(user: User) {
    const payload = { sub: user.id, email: user.email };
    const jwt = await this.jwtService.signAsync(payload);
    return jwt;
  }
}

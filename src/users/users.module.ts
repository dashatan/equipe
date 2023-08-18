import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ global: true, secret: 'token', signOptions: { expiresIn: '60s' } }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

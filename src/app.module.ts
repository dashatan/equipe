import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { RoomsModule } from './rooms/rooms.module';
import { CategoriesModule } from './categories/categories.module';
import { CitiesModule } from './cities/cities.module';
import { Room } from './rooms/entities/room.entity';
import { City } from './cities/entities/city.entity';
import { Category } from './categories/entities/category.entity';
import { Chat } from './chats/entities/chat.entity';
import { EquipesModule } from './equipes/equipes.module';
import { Equipe } from './equipes/entities/equipe.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.mongodbUrl,
      entities: [User, Equipe, Room, City, Category, Chat],
      synchronize: true,
    }),
    UsersModule,
    ChatsModule,
    RoomsModule,
    CategoriesModule,
    CitiesModule,
    EquipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

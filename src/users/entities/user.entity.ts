import { Category } from 'src/categories/entities/category.entity';
import { City } from 'src/cities/entities/city.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Column, ObjectId, Entity, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  age: number;

  @Column()
  bio: string;

  @Column()
  city: City ;

  @Column()
  categories: Category[];

  @Column() 
  rooms: Room[];

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}

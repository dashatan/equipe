import { Category } from 'src/categories/entities/category.entity';
import { City } from 'src/cities/entities/city.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, ObjectId, ObjectIdColumn } from 'typeorm';

export class Equipe {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  age: number[];

  @Column()
  status: boolean;

  @Column(() => Category)
  categories: Category[];

  @Column(() => City)
  city: City;

  @Column(() => Room)
  room: Room;

  @Column(() => User)
  owner: User;

  constructor(equipe?: Partial<Equipe>) {
    Object.assign(this, equipe);
  }
}

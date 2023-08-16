import { Column, ObjectId, Entity, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn() id: ObjectId;
  @Column() username: string;
  @Column() password: string;
  @Column() email: string;
  @Column() name: string;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}

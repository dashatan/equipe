import { Column, ObjectId, Entity, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn() id: ObjectId;
  @Column({ nullable: false }) password: string;
  @Column({ nullable: false }) email: string;
  @Column() name: string;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}

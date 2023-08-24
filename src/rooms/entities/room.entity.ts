import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, ObjectIdColumn } from 'typeorm';

export class Room {
  @ObjectIdColumn()
  _id: string;

  @Column(() => User)
  users: User;

  @Column(() => Chat)
  chats: Chat;

  constructor(room?: Partial<Room>) {
    Object.assign(this, room);
  }
}

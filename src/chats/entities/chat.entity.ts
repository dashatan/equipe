import { Column, ObjectIdColumn } from 'typeorm';

export class Chat {
  @ObjectIdColumn()
  _id: string;

  @Column()
  type: string;

  @Column()
  text: string;

  @Column()
  url: string;
}

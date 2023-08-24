import { Column, ObjectIdColumn } from 'typeorm';

export class Category {
  @ObjectIdColumn()
  _id: string;

  @Column()
  name: string;

  @Column(() => Category)
  parent: Category;

  @Column(() => Category)
  children: Category[];

  constructor(category?: Partial<Category>) {
    Object.assign(this, category);
  }
}

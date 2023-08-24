import { Column, ObjectIdColumn } from 'typeorm';

export class City {
  @ObjectIdColumn()
  _id: string;

  @Column()
  name: string;

  @Column(() => City)
  parent: City;

  @Column(() => City)
  children: City[];

  constructor(city?: Partial<City>) {
    Object.assign(this, city);
  }
}

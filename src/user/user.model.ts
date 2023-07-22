import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product/product.model';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  deposit: number;

  @Column()
  role: Role;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  dateUpdated?: Date;

  @DeleteDateColumn()
  dateDeleted?: Date;
}

@Entity({})
export class Session {
  @PrimaryColumn()
  token: string;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateUpdated: Date;

  @DeleteDateColumn()
  dateDeleted: Date;
}

export enum Role {
  BUYER = 'buyer',
  SELLER = 'seller',
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product/product.model';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  deposit: number;

  @Column()
  role: Role;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToMany(() => Session, (session) => session.user, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  sessions: Session[];

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  dateUpdated?: Date;

  @DeleteDateColumn()
  dateDeleted?: Date;

  token?: string;

  warning?: string;
}

@Entity()
export class Session {
  @PrimaryColumn()
  token: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn()
  user?: User;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  dateUpdated?: Date;

  @DeleteDateColumn()
  dateDeleted?: Date;
}

export enum Role {
  BUYER = 'buyer',
  SELLER = 'seller',
}

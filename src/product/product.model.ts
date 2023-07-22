import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { User } from '../user/user.model';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column()
  amountAvailable: number;

  @Column()
  cost: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn()
  seller?: User;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  dateUpdated?: Date;

  @DeleteDateColumn()
  dateDeleted?: Date;
}

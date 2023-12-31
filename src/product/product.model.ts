import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Entity,
  RelationId,
} from 'typeorm';
import { User } from '../user/user.model';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  seller?: User;

  @RelationId((product: Product) => product.seller)
  sellerId?: string;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  dateUpdated?: Date;

  @DeleteDateColumn()
  dateDeleted?: Date;
}

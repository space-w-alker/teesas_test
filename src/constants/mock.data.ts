import { Product } from '../product/product.model';
import { User, Role } from '../user/user.model';

export const MOCK_USERS: User[] = [
  {
    role: Role.BUYER,
    deposit: 300,
    password: '1234',
    username: 'user1',
    products: [],
    sessions: [],
  },
  {
    role: Role.SELLER,
    deposit: 200,
    password: '1234',
    username: 'user2',
    products: [],
    sessions: [],
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    amountAvailable: 10,
    id: '53b816e5-3763-4139-9581-fe12f53a8cfc',
    cost: 5,
    productName: 'Super product 1',
  },
  {
    amountAvailable: 4,
    id: '93292e17-7598-4261-bade-1b0f5bfc5563',
    cost: 8,
    productName: 'Super product 2',
  },
];

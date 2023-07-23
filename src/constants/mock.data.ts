import { Product } from '../product/product.model';
import { User, Role } from '../user/user.model';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

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

export const testDatasetSeed = async (
  user: UserService,
  product: ProductService,
) => {
  await user.registerUser({
    username: 'buyer1',
    password: 'password',
    role: Role.BUYER,
  });
  await user.registerUser({
    username: 'seller1',
    password: 'password',
    role: Role.SELLER,
  });
  await product.createProduct(
    {
      amountAvailable: 10,
      cost: 5,
      productName: 'Super product 1',
    },
    'seller1',
  );
  await product.createProduct(
    {
      amountAvailable: 4,
      cost: 8,
      productName: 'Super product 2',
    },
    'seller1',
  );
};

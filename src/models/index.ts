export interface User {
  username: string;
  password: string;
  deposit: number;
  role: Role;
}

export enum Role {
  BUYER = 'buyer',
  SELLER = 'seller',
}

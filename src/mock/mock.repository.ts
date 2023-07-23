import { UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { uuid } from 'uuidv4';

export class UserMockRepository<T> {
  constructor(
    private items: T[],
    private idField: string,
    private autoGenId: boolean = false,
  ) {}

  async find(): Promise<T[]> {
    return this.items;
  }
  async findOneByOrFail(value: Partial<T>): Promise<T> {
    const idx = this.findIndexOneBy(value);
    if (idx === -1) {
      throw new NotFoundException();
    }
    return this.items[idx];
  }
  async save(entity: T): Promise<T> {
    const idx = this.items.findIndex(
      (item) => item[this.idField] === entity[this.idField],
    );
    if (idx === -1) {
      if (this.autoGenId) {
        entity[this.idField] = uuid();
      }
      this.items.push(entity);
      return entity;
    } else {
      this.items[idx] = { ...this.items[idx], ...entity };
      return this.items[idx];
    }
  }
  async softDelete(entity: Partial<T>): Promise<Partial<UpdateResult>> {
    const idx = this.findIndexOneBy(entity);
    if (idx === -1) {
      return { affected: 0 };
    } else {
      this.items.splice(idx, 1);
      return { affected: 1 };
    }
  }
  async update() {
    return;
  }

  async increment(user: T, field: string, value: number) {
    this.items.find((v) => v[this.idField] === user[this.idField])[
      `${field}`
    ] += value;
    return;
  }

  findIndexOneBy(value: Partial<T>): number {
    return this.items.findIndex((item) => {
      for (let i = 0; i < Object.keys(value).length; i++) {
        const key = Object.keys(value)[i];
        if (value[key] !== item[key]) {
          return false;
        }
      }
      return true;
    });
  }
}

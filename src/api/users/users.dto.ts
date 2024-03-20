import { User } from './users.model.js';

export type CreateUserDto = Pick<User, 'name' | 'email'>

export type UpdateUserDto = {
  hobbies: string[]
}
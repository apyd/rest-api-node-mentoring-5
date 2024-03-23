import type { User } from './users.model';

export type CreateUserDto = Pick<User, 'name' | 'email'>

export type UpdateUserDto = {
  hobbies: string[]
}
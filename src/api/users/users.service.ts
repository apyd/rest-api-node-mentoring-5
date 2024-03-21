import crypto from 'node:crypto'

import { db } from '../../db/db'
import type { CreateUserDto, UpdateUserDto } from './users.dto'
import type { User, UserHobbies } from './users.model'

export const userService = {
  getAll: (): User[] => {
    return [...db.get('users')]
  },
  getById: (id: string): User => {
    const users = db.get('users')
    return users.find((user: User) => user.id === id)
  },
  getHobbies: (id: string): UserHobbies => {
    const hobbies = db.get('hobbies')
    return hobbies.find((hobby: UserHobbies) => hobby.id === id)
  },
  create: (createUserDto: CreateUserDto): User => {
    const newUser = {
      id: crypto.randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
    }
    db.set('users', [...db.get('users'), newUser])
    db.set('hobbies', [...db.get('hobbies'), { id: newUser.id, hobbies: [] }])
    return newUser
  },
  update: (userId: string, updateUserDto: UpdateUserDto): UserHobbies | null => {
    const hobbies = db.get('hobbies')
    const index = hobbies.findIndex(({ id }: { id: string }) => userId === id)
    if(index === -1) {
      return null
    }
    hobbies[index] = { id: userId, hobbies: [...new Set(...hobbies[index].hobbies, updateUserDto.hobbies)]}
    return hobbies[index]
  },
  delete: (userId: string): Boolean => {
    const users = db.get('users')
    const updatedUsers = users.filter((user: User) => user.id !== userId)
    if(users.length !== updatedUsers.length) {
      db.set('users', updatedUsers)
      const updatedListOfHobbies = db.get('hobbies').filter(({ id }: { id: string }) => userId !== id)
      db.set('hobbies', updatedListOfHobbies)
    }
    return users.length !== updatedUsers.length
  },
}
import { CreateUserDto } from "./users.dto.js"
import { User } from "./users.model.js"

export const extendUserWithLinks = (user: User) => {
  if(!user) return null
  return {
    user: {
      ...user
    },
    links: {
      self: `/api/users/${user.id}`,
      hobbies: `/api/users/${user.id}/hobbies`,
    },
  }
}

export const validateCreateUserDto = (user: CreateUserDto): boolean | void => {
  if (!user.name || user.name.trim() === '' || typeof user.name !== 'string') {
    throw new Error('Name is required and must be a string')
  }
  if (!user.email || !user.email.includes('@') || typeof user.email !== 'string') {
    throw new Error('Email is required and must be a real email address')
  }
  return true
}

export const validateUpdateUserHobbiesDto = (hobbies: string[]): boolean | void => {
  if (!hobbies || !Array.isArray(hobbies)) {
    throw new Error('Hobbies are required and must be an array of strings')
  }
  return true
}
import { User } from '@prisma/client'

export type UserFactory = Omit<User, 'id'>

import { Request } from 'express'

export interface IUserDataAccessor {
  getUsers(request: Request): any[]
}

export const USER_DATA_ACCESSOR = Symbol('IUserDataAccessor')

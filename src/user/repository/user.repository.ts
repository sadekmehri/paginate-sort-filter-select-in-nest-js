import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { IUserDataAccessor, USER_DATA_ACCESSOR } from 'common/interfaces'

@Injectable()
export class UserRepository {
  private readonly userDataAccessor: IUserDataAccessor

  constructor(@Inject(USER_DATA_ACCESSOR) userDataAccessor: IUserDataAccessor) {
    this.userDataAccessor = userDataAccessor
  }

  getUsers(request: Request) {
    return this.userDataAccessor.getUsers(request)
  }
}

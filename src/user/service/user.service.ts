import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repository/user.repository'
import { Request } from 'express'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getUsers(request: Request) {
    return this.userRepository.getUsers(request)
  }
}

import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'

import { UserService } from '../service/user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Req() request: Request) {
    return this.userService.getUsers(request)
  }
}

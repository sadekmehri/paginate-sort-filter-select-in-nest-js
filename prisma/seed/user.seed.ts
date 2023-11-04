import { prismaClient } from '../db/prisma'
import { createUserFactory } from '../factory/user.factory'

const data = createUserFactory()

export const insertUsers = () => {
  return prismaClient.user.createMany({
    data,
  })
}

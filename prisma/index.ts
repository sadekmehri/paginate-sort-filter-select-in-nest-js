import { prismaClient } from './db/prisma'
import PrismaUtils from './utils/prisma.util'

async function main() {
  try {
    await PrismaUtils.truncateTables()
    await PrismaUtils.insertTableRecords()
  } finally {
    await prismaClient.$disconnect()
  }
}

main()

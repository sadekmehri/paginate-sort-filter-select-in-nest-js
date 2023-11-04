import { Prisma } from '@prisma/client'
import { insertUsers } from '../seed/user.seed'
import { prismaClient } from '../db/prisma'

const prismaModelMap = Prisma.ModelName

function truncateTableTransactionProcess() {
  const truncatePromises = Object.keys(prismaModelMap).map((key) => {
    return prismaClient.$executeRawUnsafe(`TRUNCATE TABLE ${prismaModelMap[key]};`)
  })

  const transactions = [
    prismaClient.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`,
    ...truncatePromises,
    prismaClient.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`,
  ]

  return transactions
}

// This function is used to truncate all tables in the database
async function truncateTables() {
  const truncateTableTransaction = truncateTableTransactionProcess()

  try {
    await prismaClient.$transaction(truncateTableTransaction)
  } catch (e) {
    console.error('PrimsaUtil: Error truncating all tables')
  }
}

// This function is used to insert records into the database
const insertTableRecords = async () => {
  try {
    await insertUsers()
  } catch (e) {
    console.error('PrismaUtil: Error inserting records')
  }
}

const PrismaUtils = {
  truncateTables,
  insertTableRecords,
}

export default PrismaUtils

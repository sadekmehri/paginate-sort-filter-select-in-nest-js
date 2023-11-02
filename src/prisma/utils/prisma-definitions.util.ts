import { PrismaOperator } from '../types'
import { PRISMA_BOOLEAN_LIMIT, PRISMA_NUMBER_LIMIT, PRISMA_STRING_LIMIT } from '../constants'
import { ComparisonOperator, StringOrNumberOrBoolean } from '../../common/types'

export const operatorPrismaMap: Record<ComparisonOperator, PrismaOperator> = {
  '<': 'lt',
  '>': 'gt',
  '<=': 'lte',
  '>=': 'gte',
  '=': 'equals',
  '!=': 'not',
}

export const typeMaxLimitLength: Record<StringOrNumberOrBoolean, number> = {
  string: PRISMA_STRING_LIMIT,
  number: PRISMA_NUMBER_LIMIT,
  boolean: PRISMA_BOOLEAN_LIMIT,
}

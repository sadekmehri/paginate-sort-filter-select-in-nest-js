import { ClauseMeta, StringOrNumberOrBoolean } from 'common/types'
import { OR_OPERATOR, AND_OPERATOR, LOOSE_COMPARISON_FILTER_PRISMA } from 'prisma/constants'
import {
  typeMaxLimitLength,
  operatorPrismaMap,
  typeConversionMap,
} from 'prisma/utils/prisma-definitions.util'

export class PrismaFilterRequestTransformer<T> {
  private readonly filterConstraintsRecord: T

  constructor(filterConstraintsRecord: T) {
    this.filterConstraintsRecord = filterConstraintsRecord
  }

  private computeClause(clause: string): ClauseMeta | null {
    let field = ''
    let operator = ''
    let value = ''
    let i = 0

    // Get field
    while (i < clause.length) {
      const char = clause.charAt(i)
      if (char === '>' || char === '<' || char === '!' || char === '=') break
      field += char
      i++
    }

    // Check if field is filterable
    const isFieldFilterable = this.filterConstraintsRecord[field]?.filterable
    if (!isFieldFilterable) return null

    // Get operator
    while (i < clause.length) {
      const char = clause.charAt(i)

      const isEqualOperator = char === '='
      if (isEqualOperator) {
        operator += char
        i++
        break
      }

      const isComparisonOperator = char === '>' || char === '<' || char === '!'
      if (isComparisonOperator) {
        operator += char
        i++

        if (i < clause.length && clause.charAt(i) === '=') {
          operator += '='
          i++
        }
      }

      break
    }

    // Get value
    // get limit length for selected type of field and then extract value from clause based on that limit to prevent value from overflowing
    // Remove all non-alphanumeric characters except space
    const nonAlphanumericNonSpaceRegex = /[^\w\s]/g
    const selectedTypeMaxLimitLength =
      typeMaxLimitLength[this.filterConstraintsRecord[field].type] || 0
    value = clause
      .slice(i, i + selectedTypeMaxLimitLength)
      .replace(nonAlphanumericNonSpaceRegex, '')

    // Push to result
    return {
      field,
      operator,
      value,
      meta: this.filterConstraintsRecord[field],
    }
  }

  private getClauses(filterBy: string) {
    const orClauses: string[] = filterBy.split(OR_OPERATOR)
    const andClauses: string[] = []

    orClauses.forEach((orClause, index) => {
      const andParts = orClause.split(AND_OPERATOR)

      if (andParts.length > 1) {
        andClauses.push(...andParts)
        orClauses.splice(index, 1)
      }
    })

    return { orClauses, andClauses }
  }

  private buildFilterCriteria(clause: ClauseMeta) {
    const { field, operator, value, meta } = clause
    const { type } = meta

    // Check if clause is valid
    const isInvalidClause = !field || !operator || !value || !meta
    if (isInvalidClause) return null

    // Check if operator is valid
    const isInvalidOperator = !operatorPrismaMap[operator]
    if (isInvalidOperator) return null

    // Check if field is filterable
    const filterContraint = this.filterConstraintsRecord[field]
    if (!filterContraint) return null

    // Check if type is boolean and operator is not equal or not not equal
    const isBooleanAndDifferentOperator =
      type === 'boolean' && operator !== '=' && operator !== '!='
    if (isBooleanAndDifferentOperator) return null

    // Check if operator is exact
    const comparator = !filterContraint.exact
      ? LOOSE_COMPARISON_FILTER_PRISMA
      : operatorPrismaMap[operator]

    // Fill filter criteria
    const filterCriteria = {
      [field]: {
        [comparator]: this.parseValue(value, type),
      },
    }

    return filterCriteria
  }

  private parseValue(value: string, type: StringOrNumberOrBoolean) {
    const conversionFunction = typeConversionMap[type]
    return conversionFunction ? conversionFunction(value) : value
  }

  private getFilterCriteriaFromClauses(clauses: string[]) {
    const filterCriterias = []

    for (const clause of clauses) {
      // Compute clause meta data
      const clauseMeta = this.computeClause(clause)
      if (!clauseMeta) continue

      // Build filter criteria from clause meta data
      const filterCriteria = this.buildFilterCriteria(clauseMeta)
      if (!filterCriteria) continue

      // Push to result array if valid filter criteria
      filterCriterias.push(filterCriteria)
    }

    return filterCriterias
  }

  public transform(filterByTerm: string) {
    const filterCriteria = {
      OR: [],
    } as T

    const { orClauses, andClauses } = this.getClauses(filterByTerm)

    // Compute OR clauses
    const orFilterCriterias = this.getFilterCriteriaFromClauses(orClauses)
    filterCriteria['OR'].push(...orFilterCriterias)

    // Compute AND clauses
    const andFilterCriterias = this.getFilterCriteriaFromClauses(andClauses)
    const hasAndFilterCriterias = andFilterCriterias.length > 0
    if (hasAndFilterCriterias) {
      if (Array.isArray(filterCriteria['AND'])) {
        filterCriteria['AND'].push(...andFilterCriterias)
      } else {
        filterCriteria['AND'] = andFilterCriterias
      }
    }

    // Check if filter criteria is empty and delete it if it is empty to prevent prisma from throwing an error
    if (filterCriteria['OR'].length === 0) delete filterCriteria['OR']

    return filterCriteria
  }
}

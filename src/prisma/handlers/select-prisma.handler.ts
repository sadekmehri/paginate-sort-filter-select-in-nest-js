import { FIELDS } from 'common/constants/request-query-params'
import { FilterConstraintsRecord } from 'common/types'
import { Request } from 'express'
import { DataManipulationHandler } from './data-manipulation-handler'

export class SelectPrismaHandler<T extends object, D> extends DataManipulationHandler<T> {
  private readonly constraintRecord: FilterConstraintsRecord<D>

  constructor(constraintRecord: FilterConstraintsRecord<D>, next: DataManipulationHandler<T>) {
    super(next)
    this.constraintRecord = constraintRecord
    this.constraintRecord = constraintRecord
  }

  private getDefaultSelectCriterias() {
    const selectableField: Partial<Record<keyof FilterConstraintsRecord<D>, boolean>> = {}

    for (const field in this.constraintRecord) {
      if (this.constraintRecord[field]?.sortable) {
        selectableField[field] = true
      }
    }

    return selectableField
  }

  private getSelectedFieldsObject(selectedFieldsTerm: string) {
    const defaultSelectCriterias = this.getDefaultSelectCriterias()

    const fieldsObject = decodeURIComponent(selectedFieldsTerm)
      .split(',')
      .reduce((result, field) => {
        if (this.constraintRecord[field]?.selectable) {
          result[field] = true
        }

        return result
      }, {})

    const isInvalidSelectFieldsObject = Object.keys(fieldsObject).length === 0
    const selectableFieldsObjectResult = isInvalidSelectFieldsObject
      ? defaultSelectCriterias
      : fieldsObject

    return selectableFieldsObjectResult
  }

  doHandle(request: Request, queryArgs: T): boolean {
    const selectedFieldsTerm = (request.query[FIELDS] as string) || ''

    const selectableFieldsObjectResult = this.getSelectedFieldsObject(selectedFieldsTerm)

    queryArgs['select'] = selectableFieldsObjectResult

    // I return false to indicate that the next handler should be called
    return false
  }
}

import { DataManipulationHandler } from 'common/classes/data-manipulation-handler'
import { Request } from 'express'

export class SelectFieldPrismaHandler<T extends object, D> extends DataManipulationHandler<T> {
  private readonly selectableFields: D
  constructor(selectableFields: D, next: DataManipulationHandler<T>) {
    super(next)
    this.selectableFields = selectableFields
  }

  private getSelectedFieldsObject<V>(
    selectedFieldsTerm: string,
    selectableFields: V,
    defaultSelectCriterias: V,
  ) {
    const fieldsObject = decodeURIComponent(selectedFieldsTerm)
      .split(',')
      .reduce((result, field) => {
        if (selectableFields[field]) {
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
    const selectedFieldsTerm = (request.query.fields as string) || ''

    const selectableFieldsObjectResult = this.getSelectedFieldsObject<D>(
      selectedFieldsTerm,
      this.selectableFields,
      this.selectableFields,
    )

    queryArgs['select'] = selectableFieldsObjectResult

    // I return false to indicate that the next handler should be called
    return false
  }
}

import { ValidationError } from 'class-validator'
import { LooseObject } from 'common/types'

/* Override the default response of class-validation */
export const collectAttributeErrors = (validationErrors: ValidationError[] = []) => {
  const errObject: LooseObject = {}

  return validationErrors.reduce((accumulator, validationError) => {
    const errPropertyName = validationError.property
    const errConstraints = validationError.constraints

    accumulator[errPropertyName] = Object.keys(errConstraints).map((value, index) => ({
      id: index + 1,
      message: errConstraints[value],
    }))

    return accumulator
  }, errObject)
}

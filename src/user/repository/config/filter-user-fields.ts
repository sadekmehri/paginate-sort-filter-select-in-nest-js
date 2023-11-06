import { FilterConstraintsRecord, User } from 'common/types'

export const filterUserConstraintsRecord: FilterConstraintsRecord<User> = {
  id: { filterable: true, exact: true, type: 'number' },
  name: { filterable: true, exact: false, type: 'string' },
  age: { filterable: true, exact: true, type: 'number' },
  isActive: { filterable: true, exact: true, type: 'boolean' },
}

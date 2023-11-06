import { FilterConstraintsRecord, User } from 'common/types'

export const userConstraintRecord: FilterConstraintsRecord<User> = {
  id: { filterable: true, selectable: true, sortable: true, exact: true, type: 'number' },
  name: { filterable: true, selectable: true, sortable: true, exact: false, type: 'string' },
  age: { filterable: true, selectable: true, sortable: true, exact: true, type: 'number' },
  isActive: { filterable: true, selectable: true, sortable: true, exact: true, type: 'boolean' },
}

import { BooleanMap, User } from 'common/types'

export const selectableUserFields: BooleanMap<User> = {
  id: true,
  name: true,
  age: true,
  isActive: true,
}

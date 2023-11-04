import { BooleanMap, User } from 'common/types'

export const sortableUserFields: BooleanMap<User> = {
  id: true,
  name: true,
  age: true,
  isActive: true,
}

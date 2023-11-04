import { faker } from '@faker-js/faker'
import { UserFactory } from '../types'

function generateUser(): UserFactory {
  const name = faker.person.fullName()
  const age = faker.number.int({ min: 10, max: 100 })
  const isActive = faker.datatype.boolean()

  return {
    name,
    age,
    isActive,
  }
}

function createUserFactory(length: number = 10_000) {
  if (length < 0) throw new Error('createUserFactory: number of users must be greater than 0')
  return Array.from({ length }, generateUser)
}

export { createUserFactory }

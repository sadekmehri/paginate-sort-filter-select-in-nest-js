import { padSingleDigit } from './number.util'

export const toGmtTimestamp = (date: Date = new Date()) => {
  const year = padSingleDigit(date.getUTCFullYear())
  const month = padSingleDigit(date.getUTCMonth() + 1)
  const day = padSingleDigit(date.getUTCDate())
  const hours = padSingleDigit(date.getUTCHours())
  const minutes = padSingleDigit(date.getUTCMinutes())
  const seconds = padSingleDigit(date.getUTCSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

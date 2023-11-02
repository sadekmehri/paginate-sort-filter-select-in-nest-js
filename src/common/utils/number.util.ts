export function padSingleDigit(number: number) {
  return number < 10 ? `0${number}` : number.toString()
}

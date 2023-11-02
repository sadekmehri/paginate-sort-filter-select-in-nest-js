function convertStringToNumber(stringValue: string) {
  const defaultValue = 0
  const number = Number(stringValue)
  return isNaN(number) ? defaultValue : number
}

function convertStringToBoolean(stringValue: string) {
  switch (stringValue.toLocaleLowerCase()) {
    case 'true':
    case '1':
      return true
    default:
      return false
  }
}

const ConversionUtil = {
  convertStringToNumber,
  convertStringToBoolean,
}

export default ConversionUtil

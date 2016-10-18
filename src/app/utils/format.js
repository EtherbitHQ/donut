import numeral from 'numeral'

export const isPositive = (value) => value >= 0
export const getFormattedVolume = (volume) => numeral(volume).format('0.0a').toUpperCase()
export const getFormattedBTCPrice = (price) => price === 1 ? 1 : numeral(price).format('0,0.000000')
export const getFormattedCurrencyPrice = (price) => numeral(price).format('0,0.0000')

export const getFormattedPercentage = (value) => {
  const formattedValue = numeral(value / 100).format('0.00%')
  if (isPositive(value)) return `+${formattedValue}`
  else return formattedValue
}

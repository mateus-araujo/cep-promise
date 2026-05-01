import normalizeString from './normalize-string.js'

export function compareStrings (text, compareText) {
  const textNormalized = normalizeString(text)
  const compareTextNormalized = normalizeString(compareText)

  return (
    textNormalized === compareTextNormalized ||
    textNormalized.includes(compareTextNormalized) ||
    compareTextNormalized.includes(text)
  )
}

export default compareStrings

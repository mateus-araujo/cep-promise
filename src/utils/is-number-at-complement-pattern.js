export function isNumberAtComplementPattern (complement, number) {
  if (!complement || !number) return false

  const numberStr = number.toString()
  const patterns = [
    new RegExp(`\\b${numberStr}\\b`),
    new RegExp(`\\b${numberStr}-\\d+\\b`),
    new RegExp(`\\b\\d+-${numberStr}\\b`)
  ]

  return patterns.some(pattern => pattern.test(complement))
}

export default isNumberAtComplementPattern

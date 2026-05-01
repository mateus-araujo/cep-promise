import { compareStrings } from './compare-strings.js'
import { isNumberAtComplementPattern } from './is-number-at-complement-pattern.js'

function findAddressByNeighborhoodOrCity (addresses, neighborhood, city) {
  if (neighborhood) {
    return addresses.find(address => compareStrings(address.neighborhood, neighborhood))
  }

  if (city && addresses.some(address => address.city === city)) {
    return addresses.find(address => compareStrings(address.city, city))
  }

  return undefined
}

function findAddressByNumber (addressesList, number) {
  // First, try to find address where street includes the number
  if (addressesList.some(address => address.street.includes(number))) {
    return addressesList.find(address => address.street.includes(number))
  }

  // Check if any address has 'lado' in complement
  if (addressesList.some(address => address.complement.includes('lado'))) {
    const isEven = Number(number) % 2 === 0

    if (isEven) {
      // Filter for even side addresses
      const evenAddresses = addressesList.filter(address =>
        address.complement.includes('lado par')
      )
      return evenAddresses.find(address =>
        isNumberAtComplementPattern(address.complement, Number(number))
      )
    } else {
      // Filter for odd side addresses
      const oddAddresses = addressesList.filter(address =>
        address.complement.includes('lado ímpar')
      )
      return oddAddresses.find(address =>
        isNumberAtComplementPattern(address.complement, Number(number))
      )
    }
  }

  // Check if any address has a pattern match in complement
  if (addressesList.some(address => isNumberAtComplementPattern(address.complement, Number(number)))) {
    return addressesList.find(address =>
      isNumberAtComplementPattern(address.complement, Number(number))
    )
  }

  return undefined
}

export function selectAddressFromList (addresses, number, neighborhood, city) {
  // Filter by neighborhood if provided
  const addressesList = neighborhood
    ? addresses.filter(address => compareStrings(address.neighborhood, neighborhood))
    : addresses

  let selectedAddress

  if (number) {
    // Try to find address by number
    selectedAddress = findAddressByNumber(addressesList, number)

    // If not found by number, try neighborhood/city
    if (!selectedAddress) {
      selectedAddress = findAddressByNeighborhoodOrCity(addresses, neighborhood, city)
    }
  } else {
    // No number provided, use neighborhood/city
    selectedAddress = findAddressByNeighborhoodOrCity(addresses, neighborhood, city)
  }

  return { addresses, selectedAddress }
}

export default selectAddressFromList

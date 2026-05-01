import { compareStrings } from './compare-strings.js'
import { isNumberAtComplementPattern } from './is-number-at-complement-pattern.js'

function findAddressByNeighborhoodOrCity (addresses, neighborhood, city) {
  return neighborhood
    ? addresses.find(address => compareStrings(address.neighborhood, neighborhood))
    : city && addresses.some(address => address.city === city)
      ? addresses.find(address => compareStrings(address.city, city))
      : undefined
}

export function selectAddressFromList (addresses, number, neighborhood, city) {
  const addressesList = neighborhood
    ? addresses.filter(address => compareStrings(address.neighborhood, neighborhood))
    : addresses

  const selectedAddress = number
    ? addressesList.some(address => address.street.includes(number))
      ? addressesList.find(address => address.street.includes(number))
      : addressesList.some(address => address.complement.includes('lado'))
        ? Number(number) % 2 === 0
          ? addressesList
              .filter(address => address.complement.includes('lado par'))
              .find(address => isNumberAtComplementPattern(address.complement, Number(number)))
          : addressesList
              .filter(address => address.complement.includes('lado ímpar'))
              .find(address => isNumberAtComplementPattern(address.complement, Number(number)))
        : addressesList.some(address => isNumberAtComplementPattern(address.complement, Number(number)))
          ? addressesList.find(address => isNumberAtComplementPattern(address.complement, Number(number)))
          : findAddressByNeighborhoodOrCity(addresses, neighborhood, city)
    : findAddressByNeighborhoodOrCity(addresses, neighborhood, city)

  return { addresses, selectedAddress }
}

export default selectAddressFromList

'use strict'

import { getAvailableAddressSearchServices } from './services/index.js'
import Promise from './utils/promise-any.js'
import selectAddressFromList from './utils/select-address-from-list.js'
import CepPromiseError from './errors/cep-promise.js'

export default async function findAddress ({ state, city, street, number, neighborhood, providers = [] }) {
  validateInput({ state, city, street })

  const addressServices = getAvailableAddressSearchServices()

  let servicePromises

  if (providers.length === 0) {
    servicePromises = Object.entries(addressServices).map(function (entry) {
      return entry[1](state, city, street, { timeout: 30000 })
        .catch(function (error) {
          throw new Error(JSON.stringify({ message: error.message, service: entry[0] }))
        })
    })
  } else {
    servicePromises = providers.map(function (provider) {
      if (!addressServices[provider]) {
        throw new CepPromiseError({
          message: `O provider "${provider}" não suporta busca por endereço.`,
          type: 'validation_error',
          errors: [{ message: `Provider "${provider}" inválido para busca de endereço.`, service: 'providers_validation' }]
        })
      }
      return addressServices[provider](state, city, street, { timeout: 30000 })
        .catch(function (error) {
          throw new Error(JSON.stringify({ message: error.message, service: provider }))
        })
    })
  }

  try {
    const addresses = await Promise.any(servicePromises)
    const { selectedAddress } = selectAddressFromList(addresses, number, neighborhood, city)

    return { addresses, selectedAddress }
  } catch (aggregatedErrors) {
    if (aggregatedErrors.length !== undefined) {
      throw new CepPromiseError({
        message: 'Todos os serviços de busca de endereço retornaram erro.',
        type: 'service_error',
        errors: aggregatedErrors
      })
    }
    throw aggregatedErrors
  }
}

function validateInput ({ state, city, street }) {
  if (!state || state.length !== 2) {
    throw new CepPromiseError({
      message: 'Estado (UF) é obrigatório e deve ter 2 caracteres.',
      type: 'validation_error',
      errors: [{ message: 'Estado inválido.', service: 'address_validation' }]
    })
  }

  if (!city || city.length < 3) {
    throw new CepPromiseError({
      message: 'Cidade é obrigatória e deve ter pelo menos 3 caracteres.',
      type: 'validation_error',
      errors: [{ message: 'Cidade inválida.', service: 'address_validation' }]
    })
  }

  if (!street || street.length < 3) {
    throw new CepPromiseError({
      message: 'Logradouro é obrigatório e deve ter pelo menos 3 caracteres.',
      type: 'validation_error',
      errors: [{ message: 'Logradouro inválido.', service: 'address_validation' }]
    })
  }
}

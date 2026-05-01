'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'
import { normalizeString, convertViaCEPAddress } from '../utils/index.js'

export default function fetchViaCepAddressSearch (state, city, street, configurations) {
  const url = 'https://viacep.com.br/ws/' + state + '/' + normalizeString(city) + '/' + normalizeString(
    street && street.replace('Av.', 'Avenida').replace('R.', 'Rua')
  ) + '/json/'

  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    timeout: configurations.timeout || 30000
  }

  if (typeof window === 'undefined') {
    options.headers['user-agent'] = 'cep-promise'
  }

  return fetch(url, options)
    .then(analyzeAndParseResponse)
    .then(checkForViaCepError)
    .then(extractAddressesFromResponse)
    .catch(throwApplicationError)
}

function analyzeAndParseResponse (response) {
  if (response.ok) {
    return response.json()
  }

  throw Error('Erro ao se conectar com o serviço ViaCEP.')
}

function checkForViaCepError (response) {
  if (Array.isArray(response) && response.length === 0) {
    throw new Error('Nenhum endereço encontrado na base do ViaCEP.')
  }

  return response
}

function extractAddressesFromResponse (responseArray) {
  if (!Array.isArray(responseArray)) {
    throw new Error('Resposta inválida do ViaCEP.')
  }

  return responseArray.map(function (address) {
    const converted = convertViaCEPAddress(address)
    // Normalize CEP by removing dash
    converted.cep = converted.cep.replace('-', '')
    return Object.assign({}, converted, {
      service: 'viacep'
    })
  })
}

function throwApplicationError (error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'viacep'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço ViaCEP.'
  }

  throw serviceError
}

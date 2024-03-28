'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'

export default function fetchOpenCepService (cepWithLeftPad, configurations) {
  const url = `https://opencep.com/v1/${cepWithLeftPad}`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    timeout: configurations.timeout || 30000
  }

  return fetch(url, options)
    .then(analyzeAndParseResponse)
    .then(checkForOpenCepError)
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

function analyzeAndParseResponse (response) {
  if (response.ok) {
    return response.json()
  }

  throw Error('Erro ao se conectar com o serviço OpenCep.')
}

function checkForOpenCepError (responseObject) {
  if (responseObject.error === true) {
    throw new Error('CEP não encontrado na base do OpenCep.')
  }

  return responseObject
}

function extractCepValuesFromResponse (responseObject) {
  return {
    cep: responseObject.cep.replace('-', ''),
    state: responseObject.uf,
    city: responseObject.localidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro,
    service: 'opencep'
  }
}

function throwApplicationError (error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'opencep'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço OpenCep.'
  }

  throw serviceError
}

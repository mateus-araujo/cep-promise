'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiSubset from 'chai-subset'
import nock from 'nock'
import path from 'path'

import { findAddress } from '../../src/cep-promise.js'
import CepPromiseError from '../../src/errors/cep-promise.js'

chai.use(chaiAsPromised)
chai.use(chaiSubset)

let expect = chai.expect

describe('[unit] findAddress for node', () => {
  before(() => {
    nock.disableNetConnect()
  })

  describe('when imported', () => {
    it('should be a Function', () => {
      expect(findAddress).to.be.a('function')
    })
  })

  describe('when invoked without state', () => {
    it('should reject with "validation_error"', () => {
      return findAddress({ city: 'São Paulo', street: 'Rua Caiubí' }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Estado (UF) é obrigatório e deve ter 2 caracteres.',
            type: 'validation_error',
            errors: [
              {
                message: 'Estado inválido.',
                service: 'address_validation'
              }
            ]
          })
      })
    })
  })

  describe('when invoked with invalid state (not 2 chars)', () => {
    it('should reject with "validation_error"', () => {
      return findAddress({ state: 'S', city: 'São Paulo', street: 'Rua Caiubí' }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Estado (UF) é obrigatório e deve ter 2 caracteres.',
            type: 'validation_error'
          })
      })
    })
  })

  describe('when invoked without city', () => {
    it('should reject with "validation_error"', () => {
      return findAddress({ state: 'SP', street: 'Rua Caiubí' }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Cidade é obrigatória e deve ter pelo menos 3 caracteres.',
            type: 'validation_error',
            errors: [
              {
                message: 'Cidade inválida.',
                service: 'address_validation'
              }
            ]
          })
      })
    })
  })

  describe('when invoked with city less than 3 chars', () => {
    it('should reject with "validation_error"', () => {
      return findAddress({ state: 'SP', city: 'SP', street: 'Rua Caiubí' }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Cidade é obrigatória e deve ter pelo menos 3 caracteres.',
            type: 'validation_error'
          })
      })
    })
  })

  describe('when invoked without street', () => {
    it('should reject with "validation_error"', () => {
      return findAddress({ state: 'SP', city: 'São Paulo' }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Logradouro é obrigatório e deve ter pelo menos 3 caracteres.',
            type: 'validation_error',
            errors: [
              {
                message: 'Logradouro inválido.',
                service: 'address_validation'
              }
            ]
          })
      })
    })
  })

  describe('when invoked with street less than 3 chars', () => {
    it('should reject with "validation_error"', () => {
      return findAddress({ state: 'SP', city: 'São Paulo', street: 'Ru' }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Logradouro é obrigatório e deve ter pelo menos 3 caracteres.',
            type: 'validation_error'
          })
      })
    })
  })

  describe('when invoked with valid parameters', () => {
    it('should fulfill with addresses list and selectedAddress', () => {
      nock('https://viacep.com.br')
        .get('/ws/SP/Sao%20Paulo/Rua%20Caiubi/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-address-search-found.json')
        )

      return findAddress({
        state: 'SP',
        city: 'São Paulo',
        street: 'Rua Caiubí'
      }).then(result => {
        expect(result).to.have.property('addresses')
        expect(result).to.have.property('selectedAddress')
        expect(result.addresses).to.be.an('array').that.is.not.empty
        expect(result.addresses[0]).to.containSubset({
          cep: '05010000',
          street: 'Rua Caiubi',
          neighborhood: 'Perdizes',
          city: 'São Paulo',
          state: 'SP',
          service: 'viacep'
        })
      })
    })
  })

  describe('when invoked with number and neighborhood', () => {
    it('should fulfill with selectedAddress based on number/neighborhood', () => {
      nock('https://viacep.com.br')
        .get('/ws/CE/Fortaleza/Rua%20Ana%20Bilhar/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-address-search-multiple.json')
        )

      return findAddress({
        state: 'CE',
        city: 'Fortaleza',
        street: 'Rua Ana Bilhar',
        number: '601',
        neighborhood: 'Meireles'
      }).then(result => {
        expect(result).to.have.property('addresses')
        expect(result).to.have.property('selectedAddress')
        expect(result.addresses).to.be.an('array').with.length(2)
        expect(result.selectedAddress).to.containSubset({
          cep: '60160010',
          street: 'Rua Ana Bilhar',
          neighborhood: 'Meireles'
        })
      })
    })
  })

  describe('when no addresses are found', () => {
    it('should reject with "service_error"', () => {
      nock('https://viacep.com.br')
        .get('/ws/XX/InvalidCity/InvalidStreet/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-address-search-not-found.json')
        )

      return findAddress({
        state: 'XX',
        city: 'InvalidCity',
        street: 'InvalidStreet'
      }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'Todos os serviços de busca de endereço retornaram erro.',
            type: 'service_error'
          })
      })
    })
  })

  describe('when using specific provider', () => {
    it('should use only the specified provider', () => {
      nock('https://viacep.com.br')
        .get('/ws/SP/Sao%20Paulo/Rua%20Caiubi/json/')
        .replyWithFile(
          200,
          path.join(__dirname, '/fixtures/viacep-address-search-found.json')
        )

      return findAddress({
        state: 'SP',
        city: 'São Paulo',
        street: 'Rua Caiubí',
        providers: ['viacep']
      }).then(result => {
        expect(result).to.have.property('addresses')
        expect(result.addresses[0].service).to.equal('viacep')
      })
    })
  })

  describe('when using invalid provider', () => {
    it('should reject with "validation_error"', () => {
      return findAddress({
        state: 'SP',
        city: 'São Paulo',
        street: 'Rua Caiubí',
        providers: ['invalid-provider']
      }).catch(error => {
        return expect(error)
          .to.be.an.instanceOf(CepPromiseError)
          .and.containSubset({
            name: 'CepPromiseError',
            message: 'O provider "invalid-provider" não suporta busca por endereço.',
            type: 'validation_error'
          })
      })
    })
  })
})

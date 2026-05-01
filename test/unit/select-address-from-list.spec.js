'use strict'

import { expect } from 'chai'
import { selectAddressFromList } from '../../src/utils/select-address-from-list.js'

describe('[unit] selectAddressFromList', () => {
  describe('when number is provided', () => {
    it('should find address by street containing number', () => {
      const addresses = [
        { street: 'Rua ABC 123', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' },
        { street: 'Rua ABC 456', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001001' }
      ]

      const result = selectAddressFromList(addresses, '123', null, 'São Paulo')

      expect(result.selectedAddress).to.exist
      expect(result.selectedAddress.street).to.include('123')
    })

    it('should find even address when number is even and lado par exists', () => {
      const addresses = [
        { street: 'Rua ABC', complement: 'de 100 ao fim - lado par', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' },
        { street: 'Rua ABC', complement: 'de 101 ao fim - lado ímpar', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001001' }
      ]

      const result = selectAddressFromList(addresses, '200', null, 'São Paulo')

      expect(result.selectedAddress).to.exist
      expect(result.selectedAddress.complement).to.include('par')
    })

    it('should find odd address when number is odd and lado ímpar exists', () => {
      const addresses = [
        { street: 'Rua ABC', complement: 'de 100 ao fim - lado par', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' },
        { street: 'Rua ABC', complement: 'de 101 ao fim - lado ímpar', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001001' }
      ]

      const result = selectAddressFromList(addresses, '201', null, 'São Paulo')

      expect(result.selectedAddress).to.exist
      expect(result.selectedAddress.complement).to.include('ímpar')
    })

    it('should find address by complement pattern match', () => {
      const addresses = [
        { street: 'Rua ABC', complement: 'de 100/200', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' }
      ]

      const result = selectAddressFromList(addresses, '150', null, 'São Paulo')

      expect(result.selectedAddress).to.exist
    })

    it('should fallback to neighborhood when number not found', () => {
      const addresses = [
        { street: 'Rua ABC', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' },
        { street: 'Rua DEF', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', cep: '01001001' }
      ]

      const result = selectAddressFromList(addresses, '999', 'Centro', 'São Paulo')

      expect(result.selectedAddress).to.exist
      expect(result.selectedAddress.neighborhood).to.equal('Centro')
    })
  })

  describe('when number is not provided', () => {
    it('should find by neighborhood when provided', () => {
      const addresses = [
        { street: 'Rua ABC', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' },
        { street: 'Rua DEF', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', cep: '01001001' }
      ]

      const result = selectAddressFromList(addresses, null, 'Centro', 'São Paulo')

      expect(result.selectedAddress).to.exist
      expect(result.selectedAddress.neighborhood).to.equal('Centro')
    })

    it('should find by city when neighborhood not provided', () => {
      const addresses = [
        { street: 'Rua ABC', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' },
        { street: 'Rua DEF', neighborhood: 'Copacabana', city: 'Rio de Janeiro', state: 'RJ', cep: '02002000' }
      ]

      const result = selectAddressFromList(addresses, null, null, 'São Paulo')

      expect(result.selectedAddress).to.exist
      expect(result.selectedAddress.city).to.equal('São Paulo')
    })

    it('should return undefined when nothing matches', () => {
      const addresses = [
        { street: 'Rua ABC', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' }
      ]

      const result = selectAddressFromList(addresses, null, 'Inexistente', 'Inexistente')

      expect(result.selectedAddress).to.be.undefined
    })
  })

  describe('filtering', () => {
    it('should filter addresses by neighborhood when provided', () => {
      const addresses = [
        { street: 'Rua ABC', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' },
        { street: 'Rua DEF', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', cep: '01001001' }
      ]

      const result = selectAddressFromList(addresses, null, 'Jardins', 'São Paulo')

      expect(result.addresses).to.have.length(1)
      expect(result.addresses[0].neighborhood).to.equal('Jardins')
    })

    it('should not filter when neighborhood not provided', () => {
      const addresses = [
        { street: 'Rua ABC', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01001000' },
        { street: 'Rua DEF', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', cep: '01001001' }
      ]

      const result = selectAddressFromList(addresses, null, null, 'São Paulo')

      expect(result.addresses).to.have.length(2)
    })
  })
})

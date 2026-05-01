'use strict'

import { expect } from 'chai'
import normalizeString from '../../src/utils/normalize-string.js'
import { compareStrings } from '../../src/utils/compare-strings.js'
import { convertViaCEPAddress } from '../../src/utils/convert-via-cep-address.js'
import { isNumberAtComplementPattern } from '../../src/utils/is-number-at-complement-pattern.js'

describe('[unit] Utility functions', () => {
  describe('normalizeString', () => {
    it('should remove accents', () => {
      expect(normalizeString('São Paulo')).to.equal('Sao Paulo')
    })

    it('should remove special characters', () => {
      expect(normalizeString('Rua C-a,i!@#o')).to.equal('Rua Caio')
    })

    it('should handle empty string', () => {
      expect(normalizeString('')).to.equal('')
    })

    it('should handle null/undefined', () => {
      expect(normalizeString(null)).to.equal('')
      expect(normalizeString(undefined)).to.equal('')
    })
  })

  describe('compareStrings', () => {
    it('should match exact strings', () => {
      expect(compareStrings('São Paulo', 'Sao Paulo')).to.be.true
    })

    it('should match partial strings', () => {
      expect(compareStrings('São Paulo', 'Paulo')).to.be.true
    })

    it('should return false for different strings', () => {
      expect(compareStrings('São Paulo', 'Rio de Janeiro')).to.be.false
    })
  })

  describe('convertViaCEPAddress', () => {
    it('should convert ViaCEP format to library format', () => {
      const viaCepAddress = {
        cep: '05010-000',
        logradouro: 'Rua Caiubí',
        complemento: '',
        bairro: 'Perdizes',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        gia: '1004',
        ddd: '11',
        siafi: '7107'
      }

      const converted = convertViaCEPAddress(viaCepAddress)

      expect(converted).to.deep.equal({
        cep: '05010-000',
        street: 'Rua Caiubí',
        complement: '',
        neighborhood: 'Perdizes',
        city: 'São Paulo',
        state: 'SP',
        ibge: '3550308',
        gia: '1004',
        ddd: '11',
        siafi: '7107'
      })
    })
  })

  describe('isNumberAtComplementPattern', () => {
    it('should match exact number', () => {
      expect(isNumberAtComplementPattern('de 501/502 ao fim', 501)).to.be.true
    })

    it('should match number range pattern', () => {
      expect(isNumberAtComplementPattern('de 501/502 ao fim', 502)).to.be.true
    })

    it('should return false for non-matching number', () => {
      expect(isNumberAtComplementPattern('de 501/502 ao fim', 999)).to.be.false
    })

    it('should handle empty complement', () => {
      expect(isNumberAtComplementPattern('', 123)).to.be.false
    })
  })
})

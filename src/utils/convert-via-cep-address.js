export function convertViaCEPAddress (address) {
  return {
    cep: address.cep,
    street: address.logradouro,
    complement: address.complemento,
    neighborhood: address.bairro,
    city: address.localidade,
    state: address.uf,
    ibge: address.ibge,
    gia: address.gia,
    ddd: address.ddd,
    siafi: address.siafi
  }
}

export default convertViaCEPAddress

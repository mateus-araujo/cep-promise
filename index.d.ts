declare module "cep-promise" {
  /** Represents the result of a CEP search */
  export interface CEP {
    /** The retrieved CEP number */
    cep: string;
    /** The state associated with the CEP */
    state: string;
    /** The city associated with the CEP */
    city: string;
    /** The street associated with the CEP */
    street: string;
    /** The neighborhood associated with the CEP */
    neighborhood: string;
    /** The provider which returned the result */
    service: string;
  }

  /** Represents the result of a ViaCEP address search */
  export interface ViaCEPAddress {
    /** The retrieved CEP number */
    cep: string;
    /** The street name */
    street: string;
    /** The complement information */
    complement: string;
    /** The neighborhood */
    neighborhood: string;
    /** The city */
    city: string;
    /** The state (UF) */
    state: string;
    /** IBGE code */
    ibge?: string;
    /** GIA code */
    gia?: string;
    /** DDD code */
    ddd?: string;
    /** SIAFI code */
    siafi?: string;
  }

  /**
   * Available providers:
   *
   * | Provider     | Browser | Node.js |
   * | ------------ | ------- | ------- |
   * | brasilapi    | ✅      | ✅      |
   * | viacep       | ✅      | ✅      |
   * | widenet      | ✅      | ✅      |
   * | correios     | ❌      | ✅      |
   * | correios-alt | ❌      | ✅      |
   */
  export const AvailableProviders: {
    /** Supported in both **Node.js** and **Browser** environments. */
    readonly brasilapi: "brasilapi";
    /** Supported in both **Node.js** and **Browser** environments. */
    readonly viacep: "viacep";
    /** Supported in both **Node.js** and **Browser** environments. */
    readonly widenet: "widenet";
    /** Supported only in **Node.js** environment. */
    readonly correios: "correios";
    /** Supported only in **Node.js** environment. */
    readonly correiosAlt: "correios-alt";
  };

  /** Configuration options to customize the CEP search, by selecting specific providers and/or setting a timeout */
  export interface Configurations {
    /** Specifies the providers to be used for CEP searches, otherwise all available providers will be used.
     *
     * ---
     *
     * Available providers:
     *
     * | Provider     | Browser | Node.js |
     * | ------------ | ------- | ------- |
     * | brasilapi    | ✅      | ✅      |
     * | viacep       | ✅      | ✅      |
     * | widenet      | ✅      | ✅      |
     * | correios     | ❌      | ✅      |
     * | correios-alt | ❌      | ✅      |
     */
    providers?: (typeof AvailableProviders)[keyof typeof AvailableProviders][];
    /** Timeout (in milliseconds) after which the CEP search will be cancelled. */
    timeout?: number;
  }

  /**
   * Searches for CEP directly integrated with the services of Correios, ViaCEP, and WideNet (Node.js and Browser).
   *
   * ---
   *
   * @param cep The CEP (postal code) to search for.
   * @param configurations Optional configurations to customize the CEP search.
   * @returns A promise that resolves with the CEP details.
   */
  export function cep(
    cep: string | number,
    configurations?: Configurations
  ): Promise<CEP>;

  /**
   * Searches for addresses by state, city, and street.
   * Returns a list of addresses and the selected address based on number and/or neighborhood.
   * Uses multiple providers concurrently (currently supports ViaCEP).
   *
   * ---
   *
   * @param params The search parameters.
   * @param params.state - (Required) State UF. Example: 'SP'.
   * @param params.city - (Required) City name. Example: 'São Paulo'.
   * @param params.street - (Required) Street name. Example: 'Rua Caiubí'.
   * @param params.number - (Optional) Street number. Example: '123'.
   * @param params.neighborhood - (Optional) Neighborhood. Example: 'Perdizes'.
   * @param params.providers - (Optional) Providers to use. Default: all available.
   * @returns A promise that resolves with the addresses list and selected address.
   */
  export function findAddress(params: {
    state: string;
    city: string;
    street: string;
    number?: string;
    neighborhood?: string;
    providers?: string[];
  }): Promise<{
    addresses: ViaCEPAddress[];
    selectedAddress: ViaCEPAddress | undefined;
  }>;

  export default cep;
}

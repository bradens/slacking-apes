export enum Currency {
  BNB = "binancecoin",
  ETH = "ethereum"
}

export type PriceResponse<T extends Currency> = Record<T, {
  usd: number,
  last_updated_at: number
}>


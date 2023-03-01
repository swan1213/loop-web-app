/* terra:network */
import { ExtNetworkConfig } from "./types/network"

export const FINDER = "https://finder.terra.money"
export const EXTENSION = "https://terra.money/extension"
export const CHROME = "https://google.com/chrome"
export const DOCS = "https://loop.markets"
export const CDN = "https://loop-markets.sfo3.cdn.digitaloceanspaces.com/"

/* terra:configs */
export const BLOCK_TIME = 6500 // 6.5s

/* Loop fee */
export const MIN_FEE = 2

/* loop:unit */
export const SMALLEST = 1e6
export const LOOP = "LOOP"
export const LOOPR = "LOOPR"
export const ANC = "ANC"
export const ULUNA = "ULUNA"
export const LUNA = "LUNA"
export const BLUNA = "BLUNA"
export const MINE = "MINE"
export const AUST = "AUST"
export const UUSD = "uusd"
export const UST = "UST"
export const hour = '24h'
export const LP = "LP"
export const HALO = "HALO"
export const DPH = "DPH"
export const LUV = "LUV"

export const aUST_TOKEN = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu"

/* mirror:configs */
export const GENESIS = 1607022000000
export const MAX_SPREAD = 0.01
export const MAX_MSG_LENGTH = 4096
export const COMMISSION = 0.003

/* network:settings */
export const PRICES_POLLING_INTERVAL = 50000
export const TX_POLLING_INTERVAL = 1000
export const DEFAULT_EXT_NETWORK: ExtNetworkConfig = {
  name: "mainnet",
  chainID: "columbus-4",
  lcd: "https://lcd.terra.dev",
}

/* outbound */
export const TRADING_HOURS =
  "https://www.nasdaq.com/stock-market-trading-hours-for-nasdaq"

/* sentry */
export const DSN =
  "https://b1532961e54e491fbb57e67805cb36a4@o247107.ingest.sentry.io/5540998"

/* terra:wasm */
export const WASMQUERY = "WasmContractsContractAddressStore"
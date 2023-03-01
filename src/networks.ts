import { NetworkInfo as info } from "@terra-money/wallet-types"
import { LocalNetworkConfig } from "./types/network"

export type NetworkInfo = info & LocalNetworkConfig

const networks: Record<string, NetworkInfo> = {
  mainnet: {
    name: "mainnet",
    chainID: "columbus-5",
    lcd: "https://lcd.loop.markets",
    contract: "https://testbombay.loop.onl/columbus5.json",
    // contract: "https://dex.loop.markets/columbus5.json",
    mantle: "https://mantle.loop.markets/",
    stats: "https://graphql.loop.markets/graphql",
    // stats: "https://loop-api.loop.markets/graphql",
    shuttle: {
      ethereum: "",
      bsc: "",
    },
    fee: { gasPrice: 0.15, amount: 100000 }, // 0.1 UST
  },
  testnet: {
    name: "testnet",
    chainID: "bombay-12",
    lcd: "https://bombay-lcd.terra.dev",
    contract: "https://testbombay.loop.onl/bombay.json",
    mantle: "https://bombay-mantle.terra.dev/",
    stats: "https://testbombay.loop.onl/graphql",
    shuttle: {
      ethereum: "",
      bsc: "",
    },
    fee: { gasPrice: 0.456, amount: 300000 }, // 0.3 UST
  },
  bombay: {
    name: "bombay",
    chainID: "bombay-12",
    lcd: "https://bombay-lcd.terra.dev",
    contract: "https://testbombay.loop.onl/bombay.json",
    mantle: "https://bombay-mantle.terra.dev/",
    stats: "https://testbombay.loop.onl/graphql",
    shuttle: {
      ethereum: "",
      bsc: "",
    },
    fee: { gasPrice: 0.15, amount: 150000 }, // 0.15 UST.
  },
  moonshine: {
    name: "moonshine",
    chainID: "localterra",
    lcd: "https://moonshine-lcd.terra.dev",
    contract: "https://whitelist.mirror.finance/moonshine.json",
    mantle: "https://moonshine-mantle.terra.dev/",
    stats: "https://moonshine-graph.mirror.finance/graphql",
    shuttle: {
      ethereum: "",
      bsc: "",
    },
    fee: { gasPrice: 0.15, amount: 150000 }, // 0.150000 UST
  },
}

export const defaultNetwork = networks.mainnet

export default networks


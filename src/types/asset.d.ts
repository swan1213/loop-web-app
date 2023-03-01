interface Asset {
  amount: string
  token: string
  symbol?: string
}

interface ListedItem {
  symbol: string
  name: string
  token: string
  pair: string
  lpToken: string
  status: string
}

/* chain */
interface AssetInfo {
  token: { contract_addr: string }
}

interface NativeInfo {
  native_token: { denom: string }
}

interface PairPool {
  assets: Assets[]
  total_share: string
}

interface ParsePool {
  [key: string]: Assets[]
}

interface AssetToken {
  amount: string
  info: AssetInfo
}

interface NativeToken {
  amount: string
  info: NativeInfo
}

interface Assets {
  amount: string
  info: { native_token?: { denom: string }; token?: { contract_addr: string } }
}

interface Token {
  amount: string
  info: AssetInfo | NativeInfo
}

interface TokenInfoPairs {
  amount: string
  info: AssetInfo | NativeInfo
}

interface ListedItemExternal extends DefaultListedItem {
  pair?: string
  icon: string
}

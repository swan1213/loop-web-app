export enum PriceKey {
  // Dictionary<string>
  PAIR = "pair",
  ORACLE = "oracle",
}

export enum PriceKeyRecoil {
  NATIVE = "price",
  PAIR = "pair",
  ORACLE = "oracle",
  PRE = "pre",
  END = "end",
  EXTERNAL = "external",
}

export enum AssetInfoKey {
  // Dictionary<string>
  LIQUIDITY = "liquidity",
  MINCOLLATERALRATIO = "minCollateralRatio",
  LPTOTALSTAKED = "lpTotalStaked",
  LPTOTALSUPPLY = "lpTotalSupply",
}

export enum BalanceKey {
  // Dictionary<string>
  TOKEN = "token",
  LPTOTAL = "lpTotal",
  LPSTAKABLE = "lpStakable",
  LPSTAKED = "lpStaked",
  MIRGOVSTAKED = "MIRGovStaked",
  REWARD = "reward",
}
export enum BalanceKeyRecoil {
  NATIVE = "balance",
  TOKEN = "token",
  EXTERNAL = "external",
  LP = "lp",
}


export enum AccountInfoKey {
  // string
  UUSD = "uusd",
}

export enum GOVStakedKey {
  // string
  STAKEDLOOP = "stakedLoop",
}

export enum AssetBalanceKey {
  BALANCE = "balance",
  LP = "lp",
}
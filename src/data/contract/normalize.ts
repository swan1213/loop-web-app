import {atom, selector} from "recoil"
import {useStore, useStoreLoadable} from "../utils/loadable"
import {
  APRY,
  bankBalanceQuery, contractsList,
  contractsQuery,
  getAPRYQuery,
  getTotalStakedByUserQuery,
  lpTokenBalanceQuery,
  rawPairsQuery,
  Staked,
  tokenBalanceQuery
} from "./contract"
import { CONTRACT, PAIR } from "../../hooks/useTradeAssets"
import { findPairPoolPrice, TokenInfo, tokensInfoQuery } from "./info"
import { priceKeyIndexState } from "../app"
import { protocolQuery } from "./protocol"
import { LOOP, SMALLEST } from "../../constants"
import { div } from "../../libs/math"
import { lpTokenInfoQuery } from "../farming/stakeUnstake";
import {lookupSymbol, Uncapitalize} from "../../libs/parse";
import {Info} from "../../hooks/Farm/useFarmingList";
import {getPairPoolQuery, useRawPairsV2} from "./factoryV2";


/* balance */
export const tokenBalancesQuery = selector({
  key: "tokenBalances",
  get: ({ get }) => {
    get(priceKeyIndexState)
    const result = get(tokenBalanceQuery)
    return result ? dict(result, ({ balance }) => balance) : {}
    // return result ? result : {}
  },
})

export const lpTokenBalancesQuery = selector({
  key: "lpTokenBalancesQuery",
  get: ({ get }) => {
    const result = get(lpTokenBalanceQuery)
    return result ? dict(result, ({ balance }) => balance) : {}
    // return result ? result : {}
  },
})

const lpTokenBalancesQueryState = atom<any>({
  key: "lpTokenBalancesQueryState",
  default: {},
})


export const useLpTokenBalancesQuery = () => {
  return useStore(lpTokenBalancesQuery, lpTokenBalancesQueryState)
}


export const getTokenBalance = selector({
  key: "getTokenBalance",
  get: ({ get }) => {
    const tokenBalances = get(tokenBalancesQuery)
    if (tokenBalances) {
      return (token: string) => {
        return tokenBalances[token]
      }
    }
  },
})

export const getLpTokenBalance = selector({
  key: "getLpTokenBalance",
  get: ({ get }) => {
    const tokenBalances = get(lpTokenBalancesQuery)
    if (tokenBalances) {
      return (lpToken: string) => {
        return tokenBalances[lpToken]
      }
    }
  },
})

export const useGetLpTokenBalance = () => {
  const { contents: tokenBalances } = useLpTokenBalancesQuery()
  if (tokenBalances) {
    return (lpToken: string) => {
      return tokenBalances[lpToken]
    }
  }
}


/*export const farmRewardQuery = selector({
  key: "farmRewardQuery",
  get: ({ get }) => {
    const result = get(getFarmReward)
    return result ? dict(result, ({ distribution_tokens_info }) => distribution_tokens_info) : {}
  },
})*/

/* balance */
export const nativeBalancesQuery = selector({
  key: "nativeBalances",
  get: ({ get }) =>
      reduceByDenomAmount(get(bankBalanceQuery)?.BankBalancesAddress?.Result ?? []),
})

const nativeBalancesState = atom<any>({
  key: "nativeBalancesState",
  default: {},
})

const tokenBalancesState = atom<any>({
  key: "tokenBalancesState",
  default: {},
})

const lpTokenBalancesState = atom<any>({
  key: "lpTokenBalancesState",
  default: {},
})

const rawPairsTokensState = atom<{ pairs: PAIR[] } | undefined>({
  key: "rawPairsTokensState",
  default: undefined,
})

const contractsFullFormState = atom<CONTRACT[] | undefined>({
  key: "contractsFullFormState",
  default: [],
})

const contractsListState = atom<any[] | undefined>({
  key: "contractsListState",
  default: [],
})

const tokensInfoState = atom<any>({
  key: "tokensInfoState",
  default: [],
})

/*const pairsPoolState = atom<Dictionary<ParsePool>| undefined>({
  key: "pairsPoolState",
  default: undefined,
})*/

const totalStakedByUser = atom<Staked[] | undefined>({
  key: "totalStakedByUser",
  default: [],
})

const apry = atom<any>({
  key: "apry",
  default: [],
})

const pairPoolState = atom<Dictionary<PairPool> | undefined>({
  key: "pairPoolState",
  default: undefined,
})

const lpTokenInfoState = atom<Dictionary<TokenInfo> | undefined>({
  key: "lpTokenInfoState",
  default: undefined,
})

/*const nativeBalancesState = atom<Dictionary>({
  key: "nativeBalancesState",
  default: {},
})


const farmStakedByUser = atom<Dictionary<string | undefined> | undefined>({
  key: "farmStakedByUser",
  default: {},
})*/

/* store: price */
export const useNativeBalances = () => {
  return useStoreLoadable(nativeBalancesQuery, nativeBalancesState)
}

export const useTokenBalances = () => {
  return useStoreLoadable(tokenBalancesQuery, tokenBalancesState)
}

export const useLpTokenBalances = () => {
  return useStoreLoadable(lpTokenBalancesQuery, lpTokenBalancesState)
}

export const useRawPairs = () => {
  return useStore(rawPairsQuery, rawPairsTokensState)
}

export enum FactoryType {
  'fac1' = 'fac1',
  'fac2' = 'fac2',
}

export const useFarms = (type: FactoryType =  FactoryType.fac1) => {
  const { contents: fac1Contents } = useRawPairs()
  const { contents: fac2Contents } = useRawPairsV2()
  const { contents: tokensInfo } = useTokensInfo()
  const getTokenSymbol = (token: string | undefined) => token && tokensInfo ? tokensInfo[token] : undefined

  const contents = type === FactoryType.fac1 ? fac1Contents  : fac2Contents

  return contents && contents.pairs ? contents.pairs.map(
      (contractPair: {
        asset_infos: Info[]
        contract_addr: string
        liquidity_token: string

      }) => {
        const pairs = contractPair.asset_infos.map((info) => {
          if (info?.native_token !== undefined) {
            return {
              token: lookupSymbol(info.native_token.denom),
              symbol: lookupSymbol(info.native_token.denom),
            }
          } else {
            const symbol = lookupSymbol(getTokenSymbol(info.token?.contract_addr)?.symbol ?? "")

            return { token: info.token?.contract_addr, symbol: symbol.toUpperCase().startsWith('W') || symbol.toUpperCase().startsWith('B') ? Uncapitalize(symbol) : symbol }
          }
        })
        return {
          tokens: contractPair.asset_infos,
          token: contractPair.liquidity_token,
          symbol: pairs.map((pair) => pair.symbol).join(" - "),
          lpToken: contractPair.liquidity_token,
          contract_addr: contractPair.contract_addr,
        }
      }
  ) : []
}

export const useContractsFullForm = () => {
  return useStore(contractsQuery, contractsFullFormState)
}

export const useContractsList = () => {
  return useStore(contractsList, contractsListState)
}

export const usePairPool = () => {
  return useStore(getPairPoolQuery, pairPoolState)
}

/*export const usePairsPool = () => {
  return useStore(getPairPoolQuery, pairsPoolState)
}*/

export const useTotalStakedByUser = () => {
  return useStore(getTotalStakedByUserQuery, totalStakedByUser)
}

export const useAPRY = () => {
  return useStore(getAPRYQuery, apry)
}

/* info */
export const useTokensInfo = () => {
  return useStore(tokensInfoQuery, tokensInfoState)
}

export const findLpTokenInfo = selector({
  key: "findLpTokenInfo",
  get: ({ get }) => {
    const contents = get(tokensInfoQuery)

    return (token: string | undefined) => {
      return token && contents ? contents[token] : undefined
    }
  },
})

export const useFindLpTokenInfo = () => {
  const { contents } = useTokensInfo()
  return (token: string | undefined) => {
    return token && contents ? contents[token] : undefined
  }
}

/**
 * Lp token info
 */
export const useLpTokenInfo = () => {
  return useStore(lpTokenInfoQuery, lpTokenInfoState)
}

/* store: balance */
/*export const useNativeBalances = () => {
  return useStore(nativeBalancesQuery, nativeBalancesState)
}*/

/* LOOP Price */
const LOOPPriceQuery = selector({
  key: "LOOPPrice",
  get: ({ get }) => {
    const findPairPoolPriceFn = get(findPairPoolPrice)
    const { getPair, getToken } = get(protocolQuery)
    const pair = getPair(getToken(LOOP)) ?? "";
    if (pair && getToken(LOOP)) {
      return findPairPoolPriceFn?.(pair, getToken(LOOP)) ?? "0"
    }
    return "0"
  },
})

export const LOOPPriceState = atom({
  key: "LOOPPriceState",
  default: "0",
})

export const useLOOPPrice = () => {
  return useStore(LOOPPriceQuery, LOOPPriceState)
}


export const useFindPairPool = () => {
  const { contents }  = usePairPool()
  // console.log("contents usePairPool", contents)
  return (pair: string) => {
    return contents?.[pair] ?? undefined
  }
}

export const useFindLpTokenSupply = () => {
  const { contents } = useLpTokenInfo();
  return (lpToken: string | undefined) => {
    return lpToken && contents ? contents[lpToken]?.total_supply ?? "0" : "0"
  }
}

/*export const useStakedByUser = () => {
  return useStore(stakedByUserFarmQuery, farmStakedByUser)
}*/

/* utils */
export const dict = <Data, Item = string>(
    dictionary: Dictionary<Data> = {},
    selector: (data: Data, token?: string) => Item
) =>
    Object.entries(dictionary).reduce<Dictionary<Item>>(
        (acc, [token, data]) =>
            selector(data, token) ? { ...acc, [token]: selector(data, token) } : acc,
        {}
    )

/* helpers */
/*export const parsePairPool = ({ assets, total_share }: PairPool) => ({
  uusd: assets.find(({ info }) => "native_token" in info)?.amount ?? "0",
  asset: assets.find(({ info }) => "token" in info)?.amount ?? "0",
  total: total_share ?? "0",
})*/

/*const reduceByDenom = (coins: MantleCoin[]) =>
  coins.reduce<Dictionary>(
    (acc, { Amount, Denom }) => ({ ...acc, [Denom]: div(Amount, SMALLEST) }),
    {}
  )*/

const reduceByDenomAmount = (coins: MantleCoin[]) =>
    coins.reduce<Dictionary>(
        (acc, { Amount, Denom }) => ({ ...acc, [Denom]: div(Amount, SMALLEST) }),
        {}
    )


/*
| find balance of lp, token, native token
 */
export const useFindBalance = () => {
  const nativeBalances = useNativeBalances()
  const tokenBalances = useTokenBalances()
  const lpTokenBalances = useLpTokenBalances()

  const dictionary = {
    ...nativeBalances,
    ...tokenBalances,
    ...lpTokenBalances,
  }

  return (token: string | undefined) => {
    return (token ? dictionary[token] ?? "0" : "0")
  }
}

export const useFindBankBalance = () => {
  const nativeBalances = useNativeBalances()

  const dictionary = {
    ...nativeBalances,
  }

  return (token: string | undefined) => {
    return (token ? dictionary[token] ?? "0" : "0")
  }
}
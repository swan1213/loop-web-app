import {atom, selector, useRecoilValue} from "recoil"
import { getTerraListedContractQueriesQuery } from "../utils/queries"
import { nativeBalancesQuery, useNativeBalances } from "./normalize"
import { protocolQuery } from "./protocol"
import { getContractQueryQuery } from "../utils/query"
import { addressState } from "../wallet"
import {  useStoreLoadable } from "../utils/loadable"
import {getLpTokenContractQuery} from "../farming/stakeUnstake";
import {priceKeyIndexState} from "../app";
import {gte} from "../../libs/math";
import {lookupSymbol} from "../../libs/parse";
import {getPairsPriceQuery, useGetPairsPriceQuery} from "./factoryV2";

export interface TokenInfo {
  name: string,
  symbol: string,
  decimals: number,
  total_supply: string
  token: string
}
export interface Reward { info: { token: { contract_addr: string } }, amount: string }

export const tokensInfoQuery = selector({
  key: "tokensInfoQuery",
  get: async ({ get }) => {
    const getTerraListedContractQueries = get(getTerraListedContractQueriesQuery)
    if (getTerraListedContractQueries) {
      return await getTerraListedContractQueries<TokenInfo>(
        ({ contract_addr }: { contract_addr: string }) => ({ contract: contract_addr, msg: { token_info: {} } }),
        "tokensInfoQuery"
      )
    }
  },
})

export const lpTokensInfoQuery = selector({
  key: "lpTokensInfoQuery",
  get: async ({ get }) => {
    const getTerraListedContractQueries = get(getLpTokenContractQuery)
    if (getTerraListedContractQueries) {
      return await getTerraListedContractQueries<TokenInfo>(
          (lp: string ) => ({ name: lp, contract: lp, msg: { token_info: {} } }),
          "lpTokensInfoQuery"
      )
    }
  },
})

const getTokenInfoQueryState = atom<any>({
  key: "getTokenInfoQueryState",
  default: {},
})

export const useTokenInfoQuery = () => {
  return useStoreLoadable(tokensInfoQuery, getTokenInfoQueryState)
}


export const getTokenInfoQuery = selector({
  key: "getTokenInfoQuery",
  get: ({ get }) => {
    const tokensInfo = get(tokensInfoQuery)
    if (tokensInfo) {
      return (token: string) => {
        const item =  tokensInfo[token]
        return {...item, symbol: item ? lookupSymbol(item.symbol) : ""}
      }
    }
  },
})

export const getTokenInfoMethods = selector({
  key: "getTokenInfoMethods",
  get: async ({ get }) => {
    const tokensInfo = await get(tokensInfoQuery)

    const check8decOper = (addr?: string) => {
      return <boolean>(addr && gte(tokensInfo?.[addr]?.decimals ?? "6", "8")) as boolean
    }

    const check8decTokens = (addr1?: string, addr2?: string) => {
      return <boolean>((addr1 && gte(tokensInfo?.[addr1]?.decimals ?? "6", "8")) || (addr2 && gte(tokensInfo?.[addr2]?.decimals ?? "6", "8")) ) as boolean
    }

    const getSymbol = (token?: string) => {
      return token && tokensInfo?.[token] ? tokensInfo?.[token].symbol : ""
    }

    /*const getToken = (symbol?: string) =>
        !symbol
            ? ""
            : symbol === UUSD
                ? symbol
                : Object.keys(tokensInfo).find((item)=> tokensInfo?.[item].symbol === symbol ? tokensInfo?.[item].token : false)?.[0]*/

    return{
      check8decOper,
      check8decTokens,
      getSymbol
    }
  },
})

export const useTokenMethods = () => {
  return useRecoilValue(getTokenInfoMethods)
}

export const getLpTokenInfoQuery = selector({
  key: "getLpTokenInfoQuery",
  get: ({ get }) => {
    const tokensInfo = get(lpTokensInfoQuery)
    if (tokensInfo) {
      return (token: string) => {
        return tokensInfo[token]
      }
    }
  },
})

export const useGetTokenInfoQuery = () => {
  const tokensInfo = useTokenInfoQuery()
  if (tokensInfo) {
    return (token: string) => {
      const item = tokensInfo[token]
      return item ? {...item, symbol: lookupSymbol(item?.symbol)} : undefined
    }
  }
}

export const findPairPoolPrice = selector({
  key: "findPairPoolPrice",
  get: ({ get }) => {
    const getPairsPrices = get(getPairsPriceQuery)
    if (getPairsPrices) {
      return (pair: string, token: string) => {
        // @ts-ignore
        const item = getPairsPrices.find((item) => item.pair === pair);
        if (item && token) {
          return item.token === token ? item.pool : item.uusdPool
        }
        return "0"
      }
    }
  },
})

export const useFindPairPoolPrice = () => {
  const contents   = useGetPairsPriceQuery()
    return (pair: string, token: string) => {

      const item = contents && contents.length > 0 ? contents.find((item) => item.pair === pair) : undefined;
      if (item) {
        return item.token === token ? item.pool : item.uusdPool
      }
      return "0"
    }
}


/*export const findPairPool = selector({
  key: "findPairPool",
  get: ({ get }) => {
    const getPairPools = get(getPairPoolQuery)

    return (pair: string) => {
      // @ts-ignore
      const pool: PairPool | undefined = getPairPools?.[pair] ?? undefined
      return pool
    }
  },
})*/

export const findNativeBalance = selector({
  key: "findNativeBalance",
  get: ({ get }) => {
    const nativeBalances = get(nativeBalancesQuery)

    return (token: string) => nativeBalances[token] ?? undefined
  },
})

export const FindNativeBalanceDetails = () => {
  const nativeBalances = useNativeBalances()
  return (token: string) => nativeBalances[token] ?? undefined
}


export const totatStakedLoopQuery = selector({
  key: "totatStakedLoopQuery",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<string | undefined>(
      {
        contract: contracts["loop_staking"],
        msg: { total_staked: {} },
      },
      "totatStakedLoopQuery"
    )
  },
})

export const depositedQuery = selector({
  key: "depositedQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const address = get(addressState)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<string | undefined>(
      {
        contract: contracts["loop_staking"],
        msg: { query_staked_by_user: { wallet: address } },
      },
      "depositedQuery"
    )
  },
})

// Accumulated Rewards for all whitelist
export const accumulatedRewardsQuery = selector({
  key: "accumulatedRewardsQuery",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<Reward[] | undefined>(
      {
        contract: contracts["loop_staking"],
        msg: { all_wl: {} },
      },
      "accumulatedRewardsQuery"
    )
  },
})

/*
export const totalTokenStakedQuery = selector({
  key: "totalTokenStakedQuery",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const accumulatedRewards = get(accumulatedRewardsQuery)

    return accumulatedRewards?.find((reward) => reward.info.token.contract_addr === contracts["loopToken"])?.amount ?? "0" as string
  },
})*/

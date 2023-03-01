import { atom, selector } from "recoil"
import {
  getListedContractQueriesQuery, getListedLpContractQueriesQuery,
} from "../utils/queries"
import { addressState } from "../wallet"
import { getContractQueryQuery, getNativeQueryQuery } from "../utils/query"
import { protocolQuery } from "./protocol"
import { CONTRACT, PAIR } from "../../hooks/useTradeAssets"
import { BANK_BALANCES_ADDRESS } from "../native/gqldocs"
import {priceKeyIndexState} from "../app"
import { bankBalanceIndexState } from "../native/balance"
import {getListedPairAddrsState} from "../stats/contracts"
import { getTokenInfoQuery } from "./info"
import {isNative, lookupSymbol, Uncapitalize} from "../../libs/parse"
import {useStore} from "../utils/loadable"
import {allPairsQuery} from "./pairs"
import {allPairsV2Query} from "./factoryV2"

export interface Staked { amount: string, asset: { token: { contract_addr: string } } }
export interface APRY {
  asset: {
    token: {
      contract_addr: string,
    },
  },
  apr: string,
  apy: string,
  liqval: string,
}

export const rawPairsQuery = selector({
  key: "rawPairsQuery",
  get: async ({ get }) => {
    const listdPairs = get(getListedPairAddrsState)
    const pairs = get(allPairsQuery)
    const newPairsList = get(allPairsV2Query)
    const newPairs = newPairsList.filter((item) => !['terra1k0f77x4057fexvmyrhzwhge3vxcl5kkgwck89p'].includes(item.contract_addr))
    
    // const pairs: PAIR[] = all_pairs.pairs
    const paginatePairs = pairs.filter((item)=> !['terra1vdrxu6mskdgy0w0jcrtmjlrddfyulgwgj88dtw', 'terra1vduap6etw4663p0t9x534s95f6ghmg8nk2f4mh'].includes(item.contract_addr))
    const filter_pairs = listdPairs && listdPairs.length > 0
        ? [...pairs, ...newPairs]?.filter((item) => listdPairs.includes(item.contract_addr) && !['terra1vdrxu6mskdgy0w0jcrtmjlrddfyulgwgj88dtw', 'terra1vduap6etw4663p0t9x534s95f6ghmg8nk2f4mh'].includes(item.contract_addr)) : paginatePairs;

    return { ...pairs, ...newPairs, pairs: filter_pairs && filter_pairs.length > 0 ? filter_pairs : [] }
  }
})

export const getLoopPairsQuery = selector({
  key: "getLoopPairsQuery",
  get: async ({ get }) => {
    const rawPairs = get(rawPairsQuery);

    return (rawPairs && rawPairs.pairs &&
        rawPairs.pairs.map((pair: PAIR) => pair.contract_addr)) as string[]
  },
})

export const contractsQuery = selector({
  key: "contractsQuery",
  get: async ({ get }) => {
    const rawPairs = get(rawPairsQuery)
    const sortedContractsList: CONTRACT[] = [];
    rawPairs && rawPairs.pairs &&
    rawPairs.pairs.map((pair: PAIR) => {
      const assets = pair.asset_infos;
      const token1 = assets[0].token ? assets[0].token.contract_addr : assets[0].native_token?.denom;
      const token2 = assets[1].token ? assets[1].token.contract_addr : assets[1].native_token?.denom;
      if (token1) {
        sortedContractsList.push({
          contract_addr: token1,
          token: token1,
          denom: isNative(token1) ? (token1 ?? "") : '',
          isNative: isNative(token1),
          pair: pair.contract_addr,
          lp: pair.liquidity_token,
          tokenSymbol: '',
          tokenName: '',
          secondToken: token2 ?? "",
        })
      }
      if (token2) {
        sortedContractsList.push({
          contract_addr: token2,
          token: token2,
          denom: isNative(token2) ? (token2 ?? "") : '',
          isNative: isNative(token2),
          pair: pair.contract_addr,
          lp: pair.liquidity_token,
          tokenSymbol: '',
          tokenName: '',
          secondToken: token1 ?? "",
        })
      }
      return sortedContractsList;
    })
    return (sortedContractsList) as CONTRACT[] | undefined
  },
})


export const findTokenByPair = selector({
  key: "findTokenByPair",
  get: async ({ get }) => {
    const contracts = await get(contractsQuery)
    return (pair: string) => {
      return contracts && contracts.filter((item)=> item.pair === pair)
    }
  }
})

export const contractsList = selector({
  key: "contractsList",
  get: async ({ get }) => {
    const contracts = await get(contractsQuery);
    const getTokenInfoFn = await get(getTokenInfoQuery);

    return contracts?.map((item) => {
      const tokenInfo = item.isNative ? {
        symbol: item.denom,
        name: lookupSymbol(item.denom),
        decimals: 6,
      } : getTokenInfoFn?.(item.token);

      const symb = lookupSymbol(tokenInfo?.symbol ?? "")

      return {
        ...item, tokenSymbol: symb.toUpperCase().startsWith('W') || symb.toUpperCase().startsWith('B') ? Uncapitalize(symb) : symb,
        tokenName: tokenInfo?.name ?? "", decimals: tokenInfo?.decimals
      }
    })
  },
})

export const tokenBalanceQuery = selector({
  key: "tokenBalance",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const address = get(addressState)

    if (address) {
      const getListedContractQueries = get(getListedContractQueriesQuery)
      return await getListedContractQueries<Balance>(
          ({ contract_addr }: { contract_addr: string }) => ({ contract: contract_addr, msg: { balance: { address } } }),
          "tokenBalance"
      )
    }
  },
})
/*
export const getPairPoolQuery = selector({
  key: "getPairPoolQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const getTerraListedContractQueries = get(getPairsContractQueriesQuery)
    if (getTerraListedContractQueries) {
      return await getTerraListedContractQueries<PairPool>(
        (pair: string) => ({ contract: pair, msg: { pool: {} } }),
        "getPairPoolQuery"
      )
    }
  },
})*/

/*export const getPairsPriceQuery = selector({
  key: "getPairsPriceQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const getPairPoolQueries = get(getPairPoolQuery)
    return getPairPoolQueries ? Object.keys(getPairPoolQueries).map((key) => {
      const { assets } = getPairPoolQueries[key];
      const parseAssets = assets ? assets.map((item) => {
        const info = item.info
        return { ...item, amount: item.amount, real_token: info.token ? info.token.contract_addr : info.native_token?.denom }
      }) : [];

      const token1 = parseAssets[0].info
      const token2 = parseAssets[1].info

      return {
        pair: key,
        token: token1.native_token ? token1.native_token?.denom : (token1.token?.contract_addr ?? "0"),
        second_token: token2.native_token ? token2.native_token?.denom : (token2.token?.contract_addr ?? "0"),
        pool: div(parseAssets[1]?.amount, parseAssets[0].amount),// token 1 price by pool
        uusdPool: div(parseAssets[0]?.amount, parseAssets[1].amount)//second token price by pool
      }
    }) : []
  },
})

export const getPairsPriceQueryState = atom<{ pair: string, token: string, second_token: string, pool: string, uusdPool: string}[]>({
  key: "getPairsPriceQueryState",
  default: [],
})

export const useGetPairsPriceQuery = () => {
  return useStoreLoadable(getPairsPriceQuery, getPairsPriceQueryState)
}*/

export const lpTokenBalanceQuery = selector({
  key: "lpTokenBalance",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const address = get(addressState)
    if(address) {
      const getListedContractQueries = get(getListedLpContractQueriesQuery)
      return await getListedContractQueries<Balance>(
          ({lp}: { lp: string }) => ({contract: lp, msg: {balance: {address: address ?? ''}}}),
          "lpTokenBalance"
      )
    }
  }
})

export const getTotalStakedByUserQuery = selector({
  key: "getTotalStakedByUserQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const address = get(addressState)

    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<Staked[] | undefined>(
        {
          contract: contracts["loop_farm_staking"],
          msg: { total_staked_by_user: { name: address ?? '' } },
        },
        "getTotalStakedByUserQuery"
    )
  },
})

export const getAPRYQuery = selector({
  key: "getAPRYQuery",
  get: async () => {
    // const { contracts } = get(protocolQuery)
    // const getContractQuery = get(getContractQueryQuery)
    //@todo uncomment it
    return [];/*await getContractQuery<APRY[] | undefined>(
      {
        contract: contracts["loop_farm_staking"],
        msg: { apry:{}},
      },
      "getAPRYQuery"
    )*/
  },
})

const getAPRYQueryState = atom<any>({
  key: "getAPRYQueryState",
  default: [],
})


export const useGetAPRYQuery = () => {
  return useStore(getAPRYQuery, getAPRYQueryState)
}

export const findAPRY = selector({
  key: "findAPRY",
  get: async ({ get }) => {
    const apry = get(getAPRYQuery);

    return (token: string) => apry?.find((apr: APRY) => apr.asset.token.contract_addr == token) ?? {
      asset: {
        token: {
          contract_addr: "",
        },
      },
      apr: "0",
      apy: "0",
      liqval: "0",
    }
  },
})

export const useFindAPRY = () => {
  const apry = useGetAPRYQuery().contents
  return (token: string) => apry?.find((apr: APRY) => apr.asset.token.contract_addr == token) ?? {
    asset: {
      token: {
        contract_addr: "",
      },
    },
    apr: "0",
    apy: "0",
    liqval: "0",
  }
}

export const bankBalanceQuery = selector({
  key: "bankBalance",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    get(bankBalanceIndexState)
    const address = get(addressState)

    if (address) {
      const getNativeQuery = get(getNativeQueryQuery)
      return await getNativeQuery<BankBalanceAddress>(
          { document: BANK_BALANCES_ADDRESS, variables: { address } },
          "BankBalancesAddress"
      )
    }
  },
})

export const getFarmReward = selector({
  key: "getFarmReward",
  get: async ({ get }) => {
    const getListedContractQueries = get(getListedLpContractQueriesQuery)
    return await getListedContractQueries<{ distribution_tokens_info: any }>(
        ({ lp }: { lp: string }) => ({ contract: lp, msg: { query_reward: { pool: lp } } }),
        "getFarmReward"
    )
  },
})

export const getQuery12MONStakedByUser = selector({
  key: "get12MONStakedByUserQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const address = get(addressState)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<Staked[] | undefined>(
        {
          contract: contracts["loop_staking"],
          msg: { query_staked_by_user: { wallet: address } },
        },
        "get12MONStakedByUserQuery"
    )
  },
})

export const getQuery18MONStakedByUser = selector({
  key: "get18MONStakedByUserQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const address = get(addressState)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<Staked[] | undefined>(
        {
          contract: contracts["loop_staking_18"],
          msg: { query_staked_by_user: { wallet: address } },
        },
        "get18MONStakedByUserQuery"
    )
  },
})

export const getQuery3MONStakedByUser = selector({
  key: "get3MONStakedByUserQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const address = get(addressState)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<Staked[] | undefined>(
        {
          contract: contracts["loop_staking_3"],
          msg: { query_staked_by_user: { wallet: address } },
        },
        "get3MONStakedByUserQuery"
    )
  },
})






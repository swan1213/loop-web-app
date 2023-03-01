import {atom, selector} from "recoil"
import {
  getListedContractQueriesQuery,
  getPairsContractQueriesQuery,
} from "../utils/queries"
import { addressState } from "../wallet"
import { getContractQueryQuery } from "../utils/query"
import { protocolQuery } from "./protocol"
import { CONTRACT, PAIR } from "../../hooks/useTradeAssets"
import { div } from "../../libs/math"
import {priceKeyIndexState} from "../app"
import { getTokenInfoQuery } from "./info"
import {isNative, lookupSymbol, Uncapitalize} from "../../libs/parse"
import {useStore, useStoreLoadable} from "../utils/loadable"
import {LIMIT} from "./pairs"
import {iterateAllPage} from "../utils/pagination"

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

export const rawPairsV2Query = selector({
  key: "rawPairsV2Query",
  get: async ({ get }) => {
    // const listdPairs = get(getListedPairAddrsState)
    const pairs = get(allPairsV2Query)
    const filter_pairs = pairs

    // const paginatePairs = pairs.filter((item)=> !['terra1vdrxu6mskdgy0w0jcrtmjlrddfyulgwgj88dtw', 'terra1vduap6etw4663p0t9x534s95f6ghmg8nk2f4mh'].includes(item.contract_addr))
    // const filter_pairs = listdPairs && listdPairs.length > 0
    //     ? pairs?.filter((item) => listdPairs.includes(item.contract_addr) && !['terra1vdrxu6mskdgy0w0jcrtmjlrddfyulgwgj88dtw', 'terra1vduap6etw4663p0t9x534s95f6ghmg8nk2f4mh'].includes(item.contract_addr)) : paginatePairs;

    return { ...pairs, pairs: filter_pairs && filter_pairs.length > 0 ? filter_pairs : [] }
  }
})
const rawPairsTokensV2State = atom<{ pairs: PAIR[] } | undefined>({
  key: "rawPairsTokensV2State",
  default: undefined,
})

export const useRawPairsV2 = () => {
  return useStore(rawPairsV2Query, rawPairsTokensV2State)
}

export const contractsV2Query = selector({
  key: "contractsV2Query",
  get: async ({ get }) => {
    const rawPairs = get(rawPairsV2Query);
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


export const findTokenByPairV2 = selector({
  key: "findTokenByPairV2",
  get: async ({ get }) => {
    const contracts = await get(contractsV2Query)
    return (pair: string) => {
      return contracts && contracts.filter((item)=> item.pair === pair)
    }
  }
})

export const contractsListV2 = selector({
  key: "contractsListV2",
  get: async ({ get }) => {
    const contracts = await get(contractsV2Query)
    const getTokenInfoFn = await get(getTokenInfoQuery)

    //@ts-ignore
    return contracts && contracts.length > 0  ? contracts?.map((item) => {
      const tokenInfo = item.isNative ? {
        symbol: item.denom,
        name: lookupSymbol(item.denom),
        decimals: 6,
      } : getTokenInfoFn?.(item.token);

      const symbol = lookupSymbol(tokenInfo?.symbol ?? "")

      return {
        ...item, tokenSymbol: symbol.toUpperCase().startsWith('W') || symbol.toUpperCase().startsWith('B') ? Uncapitalize(symbol) : symbol,
        tokenName: tokenInfo?.name ?? "", decimals: tokenInfo?.decimals
      }
    }) : []
  },
})


export const pairsListV2 = selector({
  key: "pairsListV2",
  get: async ({get}) => {
    const contracts = await get(contractsV2Query);
    return contracts?.map((item) => item.pair)
  }
});

export const tokenBalanceQuery = selector({
  key: "tokenBalanceQuery",
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
})

export const getPairsPriceQuery = selector({
  key: "getPairsPriceQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const getPairPoolQueries = get(getPairPoolQuery)
    return getPairPoolQueries ? Object.keys(getPairPoolQueries).map((key) => {
      const { assets } = getPairPoolQueries[key];
      const parseAssets = assets ? assets.map((item) => {
        const { info } = item
        // @ts-ignore
        return { ...item, amount: item.amount, real_token: info?.token ? info?.token.contract_addr : info?.native_token?.denom }
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
}

const contractsListV2State = atom<any[] | undefined>({
  key: "contractsListV2State",
  default: [],
})

export const useContractsV2List = () => {
  return useStore(contractsListV2, contractsListV2State)
}

const pairsListV2State = atom<string[] | undefined>({
  key: "pairsListV2State",
  default: [],
})

export const usePairsV2List = () => {
  return useStore(pairsListV2, pairsListV2State)
}

export const useGetTokenListV2 = () => {
  // const contracts = useRecoilValue(contractsListV2)
  const {contents: contracts} = useContractsV2List()
  return (type: string) => {
    const uniqueList: any = []
    //improve
    contracts?.map((list: CONTRACT) => {
      const duplicat = uniqueList.find((unique: CONTRACT) => {
        return type === 'token' ?
            unique.contract_addr === list.contract_addr
            :
            unique.pair === list.pair
      })
      !duplicat && uniqueList.push(list)
    })
    return uniqueList;
  }
}

export const allPairsV2Query = selector({
  key: "allPairsV2Query",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)

    const query = async (offset?: any[]) => {
      const response = await getContractQuery<{ pairs: PAIR[] } | undefined>(
          {
            contract: contracts["tokenFactory2"],
            msg: {
              pairs: {
                limit: LIMIT,
                start_after: offset,
              }
            }
          },
          ["allPairsV2Query", offset].filter(Boolean).join(" - ")
      )
      console.log("response?.pairs", response)
      return response?.pairs ?? []
    }
    return await iterateAllPage(query, (data) => data?.asset_infos, LIMIT)
  },
})

const allPairsV2QueryState = atom<any[]>({
  key: "allPairsV2QueryState",
  default: [],
})

export const usePairs = () => {
  return useStore(allPairsV2Query, allPairsV2QueryState)
}

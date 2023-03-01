import { atom, selector } from "recoil"
import { protocolQuery } from "./protocol"
import { getContractQueryQuery } from "../utils/query"
import { addressState } from "../wallet"
import { priceKeyIndexState } from "../app"
import {getContractQueriesQuery, getListedLpContractQueriesQuery, getPairTVLContracts, PairTVL} from "../utils/queries"
import { LIST } from "../../hooks/Farm/useFarmingList";
import { PAIR } from "../../hooks/useTradeAssets";
import {
  DistributableTokensByPool,
  findListOfDistributableTokensByPool,
  getDevTokenContractQuery
} from "../farming/stakeUnstake";
import {contractsQuery} from "./contract";
import { dict } from "./normalize";
import {useStore, useStoreLoadable} from "../utils/loadable"
import {GetDevTokenDocument, getDistributedRewardaInPoolDocument} from "../../types/contract";
import alias from "./alias";

export const setFarmingListState = atom<LIST[] | undefined>({
  key: "setFarmingListState",
  default: [],
})

export const setFarmingListV2State = atom<LIST[] | undefined>({
  key: "setFarmingListV2State",
  default: [],
})
export const setContractsPairsState = atom<PAIR[] | undefined>({
  key: "setContractsPairsState",
  default: [],
})

export interface QueryUserRewardByPool {
  apr: string,
  pool: { token: { contract_addr: string } },
  rewards_info: any
}
export const queryRewardForHarvest = selector({
  key: "queryRewardForHarvest",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<string | undefined>(
      {
        contract: contracts["loop_farm_staking"],
        msg: { query_reward: { pool: contracts["loop_farm_staking"] } },
      },
      "queryRewardForHarvest"
    )
  },
})

/**
 * Get stakeable token list for farming
 */
export const listOfStakeableTokensQuery = selector({
  key: "listOfStakeableTokensQuery",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<{ distribution: [], pair_add: string, pair_add2: string, token: { token: { contract_addr: string } } }[] | undefined>(
      {
        contract: contracts["loop_farm_staking"],
        msg: { query_list_of_stakeable_tokens: {} },
      },
      "listOfStakeableTokensQuery"
    )
  },
})



const listOfStakeableTokensQueryState = atom<any>({
  key: "listOfStakeableTokensQueryState",
  default: [],
})


export const useListOfStakeableTokensQuery = () => {
  return useStore(listOfStakeableTokensQuery, listOfStakeableTokensQueryState)
}


export const query_user_reward_by_pool = selector({
  key: "query_user_reward_by_pool",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    const address = get(addressState)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<QueryUserRewardByPool[] | undefined>(
      {
        contract: contracts["loop_farm_staking"],
        msg: { query_user_reward_by_pool: { wallet: address } },
      },
      "query_user_reward_by_pool"
    )
  },
})


export const stakedByUserFarmQuery = selector({
  key: "stakedByUserFarmQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const address = get(addressState)
    const { contracts } = get(protocolQuery)
    if (address) {
      const getListedContractQueries = get(getListedLpContractQueriesQuery)
      return await getListedContractQueries<string | undefined>(
        ({ lp }: { lp: string }) => ({ contract: contracts["loop_farm_staking"], msg: { query_staked_by_user: { wallet: address, staked_token: lp } } }),
        "stakedByUserFarmQuery"
      )
    }
  },
})


const stakedByUserFarmQueryState = atom<any>({
  key: "stakedByUserFarmQueryState",
  default: {},
})


export const useStakedByUserFarmQuery = () => {
  return useStoreLoadable(stakedByUserFarmQuery, stakedByUserFarmQueryState)
}


export const findStakedByUserFarmQuery = selector({
  key: "findStakedByUserFarmQuery",
  get: async ({ get }) => {
    const stakedByUserFarm = get(stakedByUserFarmQuery);
    return (lpToken: string) => stakedByUserFarm?.[lpToken] ?? "0"
  },
})

export const useFindStakedByUserFarmQuery = () => {
  const stakedByUserFarm = useStakedByUserFarmQuery()
  return (lpToken: string) => stakedByUserFarm?.[lpToken] ?? "0"
}

// top trading assets


// setFarmingListState
// export const setFarmingList = selector({
//   key: 'setFarmingList',
//   get: async ({ get }) => {

//     return await get(setFarmingListState);
//   }
// })


// const farmingListState = atom<any>({
//   key: "farmingListState",
//   default: [],
// })


// export const useSetFarmingList = () => {
//   return useStore(setFarmingList, farmingListState)
// }


export const pairTVLQuery = selector({
  key: "pairTVLQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const list = get(setContractsPairsState)
    if (list && list.length) {
      const getListedContractQueries = get(getPairTVLContracts)
      return await getListedContractQueries<Dictionary<PairTVL> | undefined>(
        ({ liquidity_token, asset_infos }) => {
          if (!asset_infos) {
            return { token: "uusd", second_token: "uusd", lpToken: "abcde" }
          }
          const info1 = asset_infos[0];
          const info2 = asset_infos[1];
          const token1 = info1.token ? (info1.token.contract_addr ?? "") : (info1.native_token ? info1.native_token.denom : "");
          const token2 = info2.token ? (info2.token.contract_addr ?? "") : (info2.native_token ? info2.native_token.denom : "");
          return { token: token1, second_token: token2, lpToken: liquidity_token }
        },
        "pairTVLQuery"
      )
    }
  },
})

const getpairTVLQueryState = atom<any>({
  key: "getpairTVLQueryState",
  default: {},
})


export const usePairTVLQuery = () => {
  return useStore(pairTVLQuery, getpairTVLQueryState)
}
/**
 * get farming lp balance
 */
export const farminglpTokenBalanceQuery = selector({
  key: "farminglpTokenBalanceQuery",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    get(priceKeyIndexState)
    if (contracts) {
      const getListedContractQueries = get(getDevTokenContractQuery)
      if (getListedContractQueries) {
        return await getListedContractQueries<Balance>(
          (lp: string) => ({ contract: lp, name: lp, msg: { balance: { address: contracts['loop_farm_staking'] } } }),
          "farminglpTokenBalanceQuery"
        )
      }
    }
  },
})

export const farminglpTokenBalanceParsed = selector({
  key: "farminglpTokenBalanceParsed",
  get: ({ get }) => {
    const result = get(farminglpTokenBalanceQuery)
    return result ? dict(result, ({ balance }) => balance) : {}
  },
})


const farminglpTokenBalanceParsedState = atom<any>({
  key: "farminglpTokenBalanceParsedState",
  default: {},
})


export const useFarminglpTokenBalanceParsed = () => {
  return useStoreLoadable(farminglpTokenBalanceParsed, farminglpTokenBalanceParsedState)
}

export const useFindFarminglpTokenBalance = () => {
  const farminglpTokenBalance = useFarminglpTokenBalanceParsed()
  return (lp: string | undefined) => {
    return lp ? farminglpTokenBalance?.[lp] : "0"
  }
}

export const findFarminglpTokenBalance = selector({
  key: "findFarminglpTokenBalance",
  get: async ({ get }) => {
    const farminglpTokenBalance = get(farminglpTokenBalanceParsed)
    return (lp: string | undefined) => {
      return lp ? farminglpTokenBalance?.[lp] : "0"
    }
  },
})


export const findTVL = selector({
  key: "findTVL",
  get: async ({ get }) => {
    const list = get(pairTVLQuery)
    return (lpToken: string | undefined) => {
      return lpToken && list ? list[lpToken]?.liquidity : "0"
    }
  },
})

const pairsTVLState = atom<Dictionary<PairTVL | null> | undefined>({
  key: "pairsTVLState",
  default: undefined,
})


/*export const getPairPoolQuery = selector({
  key: "getPairPoolQuery",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)

    if (contracts) {
      const getListedContractQueries = get(getLpPairPoolContractQuery)
      if (getListedContractQueries) {
        return await getListedContractQueries<Balance>(
            (pair: string) => ({ contract: pair, name: pair, msg: { pool:{}} }),
            "getPairPoolQuery"
        )
      }
    }
  },
})*/

/*const pairPoolState = atom<any | undefined>({
  key: "pairPoolState",
  default: undefined,
})*/

/*
export const usePairPool = () => {
  return useStoreLoadable(getPairPoolQuery, pairPoolState)
}*/

/*export const useFindPairPool = () => {
  const contents  = usePairPool()

  return (pair: string | undefined) => {
    return pair && contents ? contents?.[pair]: undefined
  }
}*/

export const usePairsTVL = () => {
  return useStoreLoadable(pairTVLQuery, pairsTVLState)
}

export const useFindPairTVL = () => {
  const contents  = usePairsTVL()

  return (lpToken: string | undefined) => {
    return lpToken && contents ? contents?.[lpToken]?.liquidity ?? "0" : "0"
  }
}
/*
export const getPairPoolQuery = selector({
  key: "getPairPoolQuery",
  get: async ({ get }) => {
    const { contracts } = get(protocolQuery)
    get(priceKeyIndexState)
    if (contracts) {
      const getListedContractQueries = get(getLpPairPoolContractQuery)
      if (getListedContractQueries) {
        return await getListedContractQueries<Balance>(
            (pair: string) => ({ contract: pair, name: pair, msg: { pool:{}} }),
            "getPairPoolQuery"
        )
      }
    }
  },
})

const pairPoolState = atom<any | undefined>({
  key: "pairPoolState",
  default: undefined,
})*/

export const getLpPairPoolContractQuery = selector({
  key: "getLpPairPoolContractQuery",
  get: ({ get }) => {
    const contracts  = get(contractsQuery)
    const getContractQueries = get(getContractQueriesQuery)
    if (contracts) {
      return async <Parsed>(fn: GetDevTokenDocument, name: string) => {
        const document = alias(
            contracts
                .filter((item) => fn(item.pair))
                .map((item) => ({ name: fn(item.pair)?.name ?? "NaN", ...fn(item.pair) })),
            name
        )

        return await getContractQueries<Parsed>(document, name)
      }
    }
  },
})

export const getDistributedRewardsInPoolList = selector({
  key: "getDistributedRewardsInPoolList",
  get: async ({ get }) => {
    const list = get(setFarmingListState)
    return await list && list?.map(async (item) => {
      const all_rewardsFn = get(findListOfDistributableTokensByPool)
      const all_rewards = all_rewardsFn(item.lpToken)
      const distributionsFn = get(findDistributedRewardsInPool)
      const distributions = all_rewards ? await distributionsFn(all_rewards, item.lpToken, 'all') : []
      return {lpToken: item.lpToken, distributions}
    })
  }
})

export const findDistributedRewardsInPool = selector({
  key: "findDistributedRewardsInPool",
  get: ({ get }) => {
    const getDistributedRewardsInPoolFn = get(getDistributedRewardsInPool)
    const getDistributedUserRewardsInPoolFn = get(getDistributedUserRewardsInPool)
    return async (arr: DistributableTokensByPool[], lpToken: string, type: string = 'all') =>  {
      if(arr && arr.length > 0){
        if(type === 'all') {
          return await getDistributedRewardsInPoolFn(arr, lpToken)
        }else{
          return await getDistributedUserRewardsInPoolFn(arr, lpToken)
        }
      }
      return undefined
    }
  },
})

export const getDistributedRewardsInPool = selector({
  key: "getDistributedRewardsInPool",
  get: ({ get }) => {
    get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const getListedContractQueries = get(getDistributedRewardaInPoolQuery)
    return async (arr: DistributableTokensByPool[], lpToken: string) =>  {
      if(arr && arr.length > 0){
        return await getListedContractQueries<string | undefined>(
            (token: string, lpToken: string) => ({ contract: contracts["loop_farm_staking"], msg: { query_reward_in_pool: { pool: lpToken, distribution_token: token } } }),
            "getDistributedRewardsInPool",
            lpToken,
            arr
        )
      }
      return undefined
    }
  },
})

export const getDistributedUserRewardsInPool = selector({
  key: "getDistributedUserRewardsInPool",
  get: ({ get }) => {
    get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const getListedContractQueries = get(getDistributedUserRewardaInPoolQuery)
    return async (arr: DistributableTokensByPool[], lpToken: string) =>  {
      if(arr && arr.length > 0){
        return await getListedContractQueries<string | undefined>(
            (token: string, lpToken: string) => ({ contract: contracts["loop_farm_staking"], msg: { query_reward_in_pool: { pool: lpToken, distribution_token: token } } }),
            "getDistributedUserRewardsInPool",
            lpToken,
            arr
        )
      }
      return undefined
    }
  },
})

export const getDistributedUserRewardaInPoolQuery = selector({
  key: "getDistributedUserRewardaInPoolQuery",
  get: ({ get }) => {
    const getContractQueries = get(getContractQueriesQuery)
    return async <Parsed>(fn: getDistributedRewardaInPoolDocument, name: string, lpToken: string, arry: any) => {
      const document = arry && arry.length > 0  ? alias(
           arry && arry.map((item)=> (item && item.rewards_info
                .filter(({ info }) => fn(info.token.contract_addr, lpToken))
                .map(({info}) => ({ name: info.token.contract_addr, ...fn(info.token.contract_addr, lpToken) }))
          )).flat(),
          name
      )  : '{}'

      return await getContractQueries<Parsed>(document, name)
    }
  },
})

export const getDistributedRewardaInPoolQuery = selector({
  key: "getDistributedRewardaInPoolQuery",
  get: ({ get }) => {
    const getContractQueries = get(getContractQueriesQuery)
    return async <Parsed>(fn: getDistributedRewardaInPoolDocument, name: string, lpToken: string, arry: any) => {
      const document = arry && arry.length > 0  ? alias(
          arry
              .filter(({ info }) => fn(info.token.contract_addr, lpToken))
              .map(({info}) => ({ name: info.token.contract_addr, ...fn(info.token.contract_addr, lpToken) })),
          name
      )  : '{}'

      return await getContractQueries<Parsed>(document, name)
    }
  },
})

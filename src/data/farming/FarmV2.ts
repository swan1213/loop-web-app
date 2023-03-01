import {atom, atomFamily, selector, selectorFamily, useRecoilValue} from "recoil"
import { protocolQuery } from "../contract/protocol"
import { getContractQueryQuery } from "../utils/query"
import { useStore, useStoreLoadable } from "../utils/loadable"
import {
  getDistributedRewardaInPoolQuery,
  getDistributedUserRewardaInPoolQuery,
} from "../contract/farming"
import { getContractsLpQuery } from "./stakeUnstake"
import { priceKeyIndexState } from "../app"
import { addressState } from "../wallet"
import {
  getContractQueriesQuery,
  getListedLpContractQueriesQuery,
} from "../utils/queries"
import {
    dict,
} from "../contract/normalize"
import { GetDevTokenDocument } from "../../types/contract"
import alias from "../contract/alias"
import { useEffect, useState } from "react"
import {CONTRACT} from "../../hooks/useTradeAssets";
import {lookupSymbol} from "../../libs/parse";
import {useContractsV2List} from "../contract/factoryV2";
import {getListedLPV2ContractQueriesQuery} from "../contract/migrate";

export enum FarmContractTYpe {
  "Farm1" = "loop_farm_staking",
  "Farm2" = "loop_farm_staking_v2",
  "Farm3" = "loop_farm_staking_v3",
  "Farm4" = "loop_farm_staking_v4", //new farming
}

export const listOfStakeableTokensQueryFarm2 = selectorFamily({
  key: "listOfStakeableTokensQueryFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<
        | {
            distribution: []
            pair_add: string
            pair_add2: string
            token: { token: { contract_addr: string } }
          }[]
        | undefined
      >(
        {
          contract: contracts[type] ?? "",
          msg: { query_list_of_stakeable_tokens: {} },
        },
        "listOfStakeableTokensQueryFarm2"
      )
    },
})

export const listOfStakeableTokensQueryFarm3 = selectorFamily({
  key: "listOfStakeableTokensQueryFarm3",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<
        | {
            distribution: []
            pair_add: string
            pair_add2: string
            token: { token: { contract_addr: string } }
          }[]
        | undefined
      >(
        {
          contract: contracts[type] ?? "",
          msg: { query_list_of_stakeable_tokens: {} },
        },
        "listOfStakeableTokensQueryFarm3"
      )
    },
})

const listOfStakeableTokensQueryFarm2State = atom<any>({
  key: "listOfStakeableTokensQueryFarm2State",
  default: [],
})
const listOfStakeableTokensQueryFarm3State = atom<any>({
  key: "listOfStakeableTokensQueryFarm3State",
  default: [],
})

export const useListOfStakeableTokensQueryFarm2 = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    listOfStakeableTokensQueryFarm2(type),
    listOfStakeableTokensQueryFarm2State
  )
}
export const useListOfStakeableTokensQueryFarm3 = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    listOfStakeableTokensQueryFarm3(type),
    listOfStakeableTokensQueryFarm3State
  )
}
export const useStakeableListFarm2 = (type: FarmContractTYpe) => {
  const list = useRecoilValue(listOfStakeableTokensQueryFarm2(type))
  return list
    ? list.map((li) => {
        return li.token.token.contract_addr
      })
    : []
}

export const listOfStakeableTokensQueryFarm2Type = selector({
  key: "listOfStakeableTokensQueryFarm2Type",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    return async (type: FarmContractTYpe) =>
      await getContractQuery<
        | {
            distribution: []
            pair_add: string
            pair_add2: string
            token: { token: { contract_addr: string } }
          }[]
        | undefined
      >(
        {
          contract: contracts[type] ?? "",
          msg: { query_list_of_stakeable_tokens: {} },
        },
        "listOfStakeableTokensQueryFarm2Type"
      )
  },
})

export const useStakeableListFarmType = () => {
  const list = useRecoilValue(listOfStakeableTokensQueryFarm2Type)
  const [items, setItems] = useState<
    { lpToken: string; type: FarmContractTYpe }[]
  >([])

  useEffect(() => {
    Object.keys(FarmContractTYpe).map(async (key) => {
      const li = await list(FarmContractTYpe[key])
      return li
        ? li.map((li) => {
            setItems((old) => [
              ...old,
              {
                lpToken: li.token.token.contract_addr,
                type: FarmContractTYpe[key],
              },
            ])
            return li.token.token.contract_addr
          })
        : []
    })
  }, [list])

  return (lpToken: string) =>
    items.find((ar) => (ar.lpToken === lpToken ? ar.type : undefined))
}

export interface DistributableTokensByPool {
  info: { token: { contract_addr: string } }
  daily_reward: string
}

const listOfDistributableTokensByPoolFarm2State = atomFamily<Dictionary<DistributableTokensByPool[] | undefined> | undefined, FarmContractTYpe>({
    key: "listOfDistributableTokensByPoolFarm2State",
    default: undefined,
})

export const useListOfDistributableTokensByPoolFarm2 = (type: FarmContractTYpe) => {
    return useStore(queryListOfDistributableTokensByPoolFarm2(type), listOfDistributableTokensByPoolFarm2State(type))
}

export const useFindlistOfDistributableTokensByPoolFarm2 = (
  type: FarmContractTYpe
) => {
  const {contents} = useListOfDistributableTokensByPoolFarm2(type)

  return (lpToken: string | undefined) => {
    return lpToken && contents?.[lpToken] !== undefined
      ? contents?.[lpToken]
      : []
  }
}

export const queryListOfDistributableTokensByPoolFarm2 = selectorFamily({
  key: "queryListOfDistributableTokensByPoolFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getListedContractQueries = get(getDevTokenContractQueryFarm2(type))
      if (getListedContractQueries) {
        return await getListedContractQueries<
          DistributableTokensByPool[] | undefined
        >(
          (lp) => ({
            contract: contracts[type] ?? "",
            name: lp,
            msg: { query_list_of_distributable_tokens_by_pool: { pool: lp } },
          }),
          "queryListOfDistributableTokensByPoolFarm2"
        )
      }
    },
})

export const stakedByUserFarmQueryFarm2 = selectorFamily({
  key: "stakedByUserFarmQueryFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const address = get(addressState)
      const { contracts } = get(protocolQuery)
      if (address) {
        const getListedContractQueries = get(getListedLpContractQueriesQuery)
        return await getListedContractQueries<string | undefined>(
          ({ lp }: { lp: string }) => ({
            contract: contracts[type] ?? "",
            msg: {
              query_staked_by_user: { wallet: address, staked_token: lp },
            },
          }),
          "stakedByUserFarmQueryFarm2"
        )
      }
    },
})

const stakedByUserFarmQueryFarm2State = atomFamily<Dictionary<string | undefined> | undefined, FarmContractTYpe>({
  key: "stakedByUserFarmQueryFarm2State",
  default: undefined,
})

export const useStakedByUserFarmQueryFarm2 = (type: FarmContractTYpe) => {
  return useStore(
    stakedByUserFarmQueryFarm2(type),
    stakedByUserFarmQueryFarm2State(type)
  )
}

export const useFindStakedByUserFarmQueryFarm2 = (type: FarmContractTYpe) => {
  const {contents: stakedByUserFarm} = useStakedByUserFarmQueryFarm2(type)
  return (lpToken: string) => stakedByUserFarm?.[lpToken] ?? "0"
}

export const queryUserRewardInPoolFarm2 = selectorFamily({
  key: "queryUserRewardInPoolFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const address = get(addressState)
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      if (address) {
        const getListedContractQueries = get(
          getDevTokenContractQueryFarm2(type)
        )
        if (getListedContractQueries) {
          return await getListedContractQueries<
            { pool: any; rewards_info: [] } | undefined
          >(
            (lp) => ({
              contract: contracts[type] ?? "",
              name: lp,
              msg: {
                query_user_reward_in_pool: {
                  wallet: address,
                  pool: { token: { contract_addr: lp } },
                },
              },
            }),
            "queryUserRewardInPoolFarm2"
          )
        }
      }
    },
})

const queryUserRewardInPoolFarm2State = atomFamily<Dictionary<{ pool: any, rewards_info:any[]} | undefined> | undefined, FarmContractTYpe>({
  key: "queryUserRewardInPoolFarm2State",
  default: {},
})

export const useUserRewardInPoolFarm2 = (type: FarmContractTYpe) => {
  return useStore(
    queryUserRewardInPoolFarm2(type),
    queryUserRewardInPoolFarm2State(type)
  )
}

export const useFindUserRewardInPoolFarm2 = (type: FarmContractTYpe) => {
  const {contents} = useUserRewardInPoolFarm2(type)

  return (lpToken: string | undefined) => {
    return lpToken && contents?.[lpToken] !== undefined
      ? contents?.[lpToken]
      : []
  }
}

export const farminglpTokenBalanceQueryFarm2 = selectorFamily({
  key: "farminglpTokenBalanceQueryFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      get(priceKeyIndexState)
      if (contracts) {
        const getListedContractQueries = get(
          getDevTokenContractQueryFarm2(type)
        )
        if (getListedContractQueries) {
          return await getListedContractQueries<Balance>(
            (lp: string) => ({
              contract: lp,
              name: lp,
              msg: { balance: { address: contracts[type] ?? "" } },
            }),
            "farminglpTokenBalanceQueryFarm2"
          )
        }
      }
    },
})

export const farminglpTokenBalanceParsedFarm2 = selectorFamily({
  key: "farminglpTokenBalanceParsedFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const result = get(farminglpTokenBalanceQueryFarm2(type))
      return result ? dict(result, ({ balance }) => balance) : {}
    },
})

const farminglpTokenBalanceParsedFarm2State = atomFamily<Dictionary<string>, FarmContractTYpe>({
  key: "farminglpTokenBalanceParsedFarm2State",
  default: {},
})

export const useFarminglpTokenBalanceParsedFarm2 = (type: FarmContractTYpe) => {
  return useStore(
    farminglpTokenBalanceParsedFarm2(type),
    farminglpTokenBalanceParsedFarm2State(type)
  )
}

export const useFindFarminglpTokenBalanceFarm2 = (type: FarmContractTYpe) => {
  const { contents: farminglpTokenBalance} = useFarminglpTokenBalanceParsedFarm2(type)
  return (lp: string | undefined) => {
    return lp ? farminglpTokenBalance?.[lp] : "0"
  }
}

export const getDistributedRewardsInPoolFarm2 = selectorFamily({
  key: "getDistributedRewardsInPoolFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getListedContractQueries = get(getDistributedRewardaInPoolQuery)
      return async (arr: DistributableTokensByPool[], lpToken: string) => {
        if (arr && arr.length > 0) {
          return await getListedContractQueries<string | undefined>(
            (token: string, lpToken: string) => ({
              contract: contracts[type] ?? "",
              msg: {
                query_reward_in_pool: {
                  pool: lpToken,
                  distribution_token: token,
                },
              },
            }),
            "getDistributedRewardsInPoolFarm2",
            lpToken,
            arr
          )
        }
        return undefined
      }
    },
})

export const getDistributedUserRewardsInPoolFarm2 = selectorFamily({
  key: "getDistributedUserRewardsInPoolFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getListedContractQueries = get(getDistributedUserRewardaInPoolQuery)
      return async (arr: DistributableTokensByPool[], lpToken: string) => {
        if (arr && arr.length > 0) {
          return await getListedContractQueries<string | undefined>(
            (token: string, lpToken: string) => ({
              contract: contracts[type] ?? "",
              msg: {
                query_reward_in_pool: {
                  pool: lpToken,
                  distribution_token: token,
                },
              },
            }),
            "getDistributedUserRewardsInPoolFarm2",
            lpToken,
            arr
          )
        }
        return undefined
      }
    },
})

export const findDistributedRewardsInPoolFarm2 = selectorFamily({
  key: "findDistributedRewardsInPoolFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const getDistributedRewardsInPoolFn = get(
        getDistributedRewardsInPoolFarm2(type)
      )
      const getDistributedUserRewardsInPoolFn = get(
        getDistributedUserRewardsInPoolFarm2(type)
      )
      return async (
        arr: DistributableTokensByPool[] | [] | undefined,
        lpToken: string,
        type: string = "all"
      ) => {
        if (arr && arr.length > 0) {
          if (type === "all") {
            return await getDistributedRewardsInPoolFn(arr, lpToken)
          } else {
            return await getDistributedUserRewardsInPoolFn(arr, lpToken)
          }
        }
        return undefined
      }
    },
})

export const stakeableListFarm2 = selectorFamily({
  key: "stakeableListFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const list = get(listOfStakeableTokensQueryFarm2(type))
      return list
        ? list.map((li) => {
            return li.token.token.contract_addr
          })
        : []
    },
})

export const getDevTokenContractQueryFarm2 = selectorFamily({
  key: "getDevTokenContractQueryFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const contracts = get(stakeableListFarm2(type))

      const getContractQueries = get(getContractQueriesQuery)
      if (contracts) {
        return async <Parsed>(fn: GetDevTokenDocument, name: string) => {
          const document = alias(
            contracts
              .filter((item) => fn(item))
              .map((item) => ({ name: fn(item)?.name ?? "NaN", ...fn(item) })),
            name
          )

          return await getContractQueries<Parsed>(document, name)
        }
      }
    },
})

export const getLastDistributionNextPayoutQueryFarm2 = selectorFamily({
  key: "getLastDistributionNextPayoutQueryFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<string | undefined>(
        {
          contract: contracts[type] ?? "",
          msg: { query_last_distribution_time: {} },
        },
        "getLastDistributionNextPayoutQueryFarm2"
      )
    },
})

export const getDistributionWaitTimeQueryFarm2 = selectorFamily({
  key: "getDistributionWaitTimeQueryFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<string | undefined>(
        {
          contract: contracts[type] ?? "",
          msg: { query_distribution_wait_time: {} },
        },
        "getDistributionWaitTimeQueryFarm2"
      )
    },
})

const getUserStakedTimeQueryFarm2State = atom<any>({
  key: "getUserStakedTimeQueryFarm2State",
  default: {},
})

export const getUserStakedTimeQueryFarm2 = selectorFamily({
  key: "getUserStakedTimeQueryFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const address = get(addressState)
      const getTerraListedContractQueries = get(getContractsLpQuery)
      if (getTerraListedContractQueries) {
        return await getTerraListedContractQueries<string | undefined>(
          (lp: string) => ({
            contract: contracts[type] ?? "",
            msg: { query_user_staked_time: { pool: lp, wallet: address } },
            name: lp,
          }),
          "getUserStakedTimeQueryFarm2"
        )
      }
    },
})

/*export const useGetUserStakedTimeQueryFarm2 = (type: FarmContractTYpe) => {
    return useStore(getUserStakedTimeQueryFarm2(type), getUserStakedTimeQueryFarm2State)
}*/

export const useFindUsersStakedTimeFarm2 = (type: FarmContractTYpe) => {
  const userStakedTime = useRecoilValue(getUserStakedTimeQueryFarm2(type))
  if (userStakedTime) {
    return (lpToken: string | undefined) => {
      return lpToken ? userStakedTime[lpToken] ?? "" : ""
    }
  }
}

export const getLockTimeFrameQueryFarm2 = selectorFamily({
  key: "getLockTimeFrameQueryFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      return await getContractQuery<string | undefined>(
        {
          contract: contracts[type] ?? "",
          msg: { query_lock_time_frame: {} },
        },
        "getLockTimeFrameQueryFarm2"
      )
    },
})

export const getLockTimeFrameForAutoCompoundQuery = selectorFamily({
    key: "getLockTimeFrameForAutoCompoundQuery",
    get:
        (type: FarmContractTYpe) =>
            async ({ get }) => {
                get(priceKeyIndexState)
                const { contracts } = get(protocolQuery)
                const getContractQuery = get(getContractQueryQuery)
                return await getContractQuery<string | undefined>(
                    {
                        contract: contracts[type] ?? "",
                        msg: { query_lock_time_frame_for_auto_compound: {} },
                    },
                    "getLockTimeFrameForAutoCompoundQuery"
                )
            },
})

export const useFindDevTokensByLpFarm2 = (type: FarmContractTYpe) => {
  const getDevTokens = useRecoilValue(getDevTokensByLpFarm2(type))
  return (lp: string) => {
    return getDevTokens?.[lp] ?? undefined
  }
}

const getDevTokensByLpFarm2State = atom<any>({
  key: "getDevTokensByLpFarm2State",
  default: {},
})

export const useGetDevTokensByLpFarm2 = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    getDevTokensByLpFarm2(type),
    getDevTokensByLpFarm2State
  )
}

export const getDevTokensByLpFarm2 = selectorFamily({
  key: "getDevTokensByLpFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const { contracts } = get(protocolQuery)
      const getListedContractQueries = get(getDevTokenContractQueryFarm2(type))
      if (getListedContractQueries) {
        return await getListedContractQueries<string | undefined>( //todo update any to actual response
          (lp: string) => ({
            contract: contracts[type] ?? "",
            msg: { query_flp_token_from_pool_address: { pool_address: lp } },
            name: lp,
          }),
          "getDevTokensByLpFarm2"
        )
      }
    },
})

export const useFindDevTokenUserBalanceFarm2 = (type: FarmContractTYpe) => {
  const contents = useDevTokenUserBalanceFarm2(type)

  return (devToken: string | undefined) => {
    return devToken && contents?.[devToken] !== undefined
      ? contents?.[devToken].balance
      : "0"
  }
}

export const useDevTokenUserBalanceFarm2 = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    queryDevTokenUserBalanceFarm2(type),
    devTokenUserBalanceFarm2State
  )
}

const devTokenUserBalanceFarm2State = atom<
  Dictionary<{ balance: string }[] | undefined> | any
>({
  key: "devTokenUserBalanceFarm2State",
  default: undefined,
})

export const queryDevTokenUserBalanceFarm2 = selectorFamily({
  key: "queryDevTokenUserBalanceFarm2",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      get(priceKeyIndexState)
      const getListedContractQueries = get(getDevTokenContractQueryFarm2(type))
      const address = get(addressState)
      if (getListedContractQueries) {
        return await getListedContractQueries<
          { balance: string }[] | undefined
        >(
          (devToken) => ({
            contract: devToken,
            name: devToken,
            msg: { balance: { address: address } },
          }),
          "queryDevTokenUserBalanceFarm2"
        )
      }
    },
})


export const getTotalStakedForFarmingQuery = selectorFamily({
    key: "getTotalStakedForFarmingQuery",
    get:
        (type: FarmContractTYpe) =>
            async ({ get }) => {
                get(priceKeyIndexState)
                const { contracts } = get(protocolQuery)
                const getTerraListedContractQueries = get(getContractsLpQuery)
                if (getTerraListedContractQueries) {
                    return await getTerraListedContractQueries<string | undefined>(
                        (lp: string) => ({
                            contract: contracts[type] ?? "",
                            msg: { query_total_staked: { staked_token: lp } },
                            name: lp,
                        }),
                        "getTotalStakedForFarmingQuery"
                    )
                }
            },
})

export const useTotalStakedForFarming = (type: FarmContractTYpe) => {
    return useStore(
        getTotalStakedForFarmingQuery(type),
        getTotalStakedForFarmingStete
    )
}

const getTotalStakedForFarmingStete = atom<
    Dictionary<{ balance: string }[] | undefined> | any
    >({
    key: "getTotalStakedForFarmingStete",
    default: undefined,
})


export const queryGetUserAutoCompoundSubriptionQuery = selectorFamily({
    key: "queryGetUserAutoCompoundSubriptionQuery",
    get:
        (type: FarmContractTYpe) =>
            async ({ get }) => {
                get(priceKeyIndexState)
                const { contracts } = get(protocolQuery)
                const address = get(addressState)
                const getTerraListedContractQueries = get(getContractsLpQuery)
                if (getTerraListedContractQueries) {
                    return await getTerraListedContractQueries<string | undefined>(
                        (lp: string) => ({
                            contract: contracts[type] ?? "",
                            msg: {
                                query_get_user_auto_compound_subription: {
                                    user_address: address,
                                    pool_address: lp,
                                },
                            },
                            name: lp,
                        }),
                        "queryGetUserAutoCompoundSubriptionQuery"
                    )
                }
            },
})

export const useGetUserAutoCompoundSubription = (type: FarmContractTYpe) => {
    return useStore(
        queryGetUserAutoCompoundSubriptionQuery(type),
        queryGetUserAutoCompoundSubriptionState
    )
}

const queryGetUserAutoCompoundSubriptionState = atom<
    Dictionary<any | undefined> | any
    >({
    key: "queryGetUserAutoCompoundSubriptionState",
    default: {},
})

export const useFindTokenV2Details = () => {
    const { contents: contracts } = useContractsV2List()

    return (token?: string, type: string = '') => {
        if (type === 'lp') {
            const pairs = token ? contracts && contracts?.filter((list: CONTRACT) => list.lp === token) : undefined

            if (pairs) {
                return { tokenSymbol: pairs.map((pair) => lookupSymbol(pair.tokenSymbol)).join('-'), tokenName: pairs.map((pair) => lookupSymbol(pair.tokenSymbol)).join('-'), decimals: 6 }
            }
        } else if (type === 'pair') {
            const pairs = token ? contracts && contracts?.filter((list: CONTRACT) => list.pair === token) : undefined

            if (pairs) {
                return { tokenSymbol: pairs.map((pair) => lookupSymbol(pair.tokenSymbol)).join('-'), tokenName: pairs.map((pair) => lookupSymbol(pair.tokenSymbol)).join('-'), decimals: 6 }
            }
        } else {
            return token ? contracts && contracts?.find((list: CONTRACT) => list.token === token) as CONTRACT : undefined
        }
    }

}

export const lpTokenBalanceV2Query = selector({
    key: "lpTokenBalanceV2Query",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const address = get(addressState)

        const getListedContractQueries = get(getListedLPV2ContractQueriesQuery)
        return await getListedContractQueries<Balance>(
            ({ lp }: { lp: string }) => ({ contract: lp, msg: { balance: { address } } }),
            "lpTokenBalanceV2Query"
        )
    }
})


export const lpTokenBalancesV2Query = selector({
    key: "lpTokenBalancesV2Query",
    get: ({ get }) => {
        const result = get(lpTokenBalanceV2Query)
        return result ? dict(result, ({ balance }) => balance) : {}
    },
})

const lpTokenBalancesV2QueryState = atom<any>({
    key: "lpTokenBalancesV2QueryState",
    default: {},
})

export const useLpTokenBalancesV2Query = () => {
    return useStore(lpTokenBalancesV2Query, lpTokenBalancesV2QueryState)
}

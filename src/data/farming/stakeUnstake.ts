import { atom, selector } from "recoil";
import { priceKeyIndexState } from "../app";
import {
    getContractQueriesQuery
} from "../utils/queries";
import { protocolQuery, useProtocolQuery } from "../contract/protocol";
import { contractsQuery } from "../contract/contract";
import {GetDevTokenDocument, GetTokenInfoDocument} from "../../types/contract";
import alias from "../contract/alias";
import { getContractQueryQuery } from "../utils/query";
import { listOfStakeableTokensQuery, useListOfStakeableTokensQuery } from "../contract/farming";
import { addressState } from "../wallet";
import { TokenInfo } from "../contract/info";
import {useStore, useStoreLoadable} from "../utils/loadable";


export const stakeableList = selector({
    key: "stakeableList",
    get: async ({ get }) => {
        const list = get(listOfStakeableTokensQuery)
        return list ? list.map((li) => {
            return li.token.token.contract_addr
        }) : []
    },
})


export const useStakeableList = () => {
    const list = useListOfStakeableTokensQuery().contents
    return list ? list.map((li) => {
        return li.token.token.contract_addr
    }) : []
}

export const getDevTokensByLp = selector({
    key: "getDevTokensByLp",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getListedContractQueries = get(getDevTokenContractQuery)
        if (getListedContractQueries) {
            return await getListedContractQueries<string | undefined>(//todo update any to actual response
                (lp: string) => ({
                    contract: contracts["loop_farm_staking"],
                    msg: { query_flp_token_from_pool_address: { pool_address: lp } },
                    name: lp
                }),
                "getDevTokensByLp"
            )
        }
    },
})


const getDevTokensByLpState = atom<any>({
    key: "getDevTokensByLpState",
    default: {},
})


export const useGetDevTokensByLp = () => {
    return useStoreLoadable(getDevTokensByLp, getDevTokensByLpState)
}


/**
 * get user reward for farming
 */
export const queryUserRewardInPool = selector({
    key: "queryUserRewardInPool",
    get: async ({ get }) => {
        const address = get(addressState)
        const { contracts } = get(protocolQuery)
        if (address) {
            const getListedContractQueries = get(getDevTokenContractQuery)
            if (getListedContractQueries) {
                return await getListedContractQueries<{ pool: any, rewards_info: [] } | undefined>(
                    (lp) => ({
                        contract: contracts["loop_farm_staking"],
                        name: lp,
                        msg: { query_user_reward_in_pool: { wallet: address, pool: { token: { contract_addr: lp } } } }
                    }),
                    "queryUserRewardInPool"
                )
            }
        }
    },
})

const queryUserRewardInPoolState = atom<any>({
    key: "queryUserRewardInPoolState",
    default: [],
})


export const useUserRewardInPool = () => {
    return useStoreLoadable(queryUserRewardInPool, queryUserRewardInPoolState)
}

export const useFindUserRewardInPool = () => {
    const contents = useUserRewardInPool()

    return (lpToken: string | undefined) => {
        return lpToken && contents?.[lpToken] !== undefined ? contents?.[lpToken] : []
    }
}

/**
 * get list of distributable tokes by pool query farming
 */
export const queryListOfDistributableTokensByPool = selector({
    key: "queryListOfDistributableTokensByPool",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getListedContractQueries = get(getDevTokenContractQuery)
        if (getListedContractQueries) {
            return await getListedContractQueries<DistributableTokensByPool[] | undefined>(
                (lp) => ({
                    contract: contracts["loop_farm_staking"],
                    name: lp,
                    msg: { query_list_of_distributable_tokens_by_pool: { pool: lp } }
                }),
                "queryListOfDistributableTokensByPool"
            )
        }
    },
})

export const queryDevTokenInfo = selector({
    key: "queryDevTokenInfo",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const getListedContractQueries = get(getDevTokenContractQuery)
        if (getListedContractQueries) {
            return await getListedContractQueries<TokenInfo | undefined>(
                (devToken) => ({
                    contract: devToken,
                    name: devToken,
                    msg: { token_info: {} }
                }),
                "queryDevTokenInfo"
            )
        }
    },
})

export const queryDevTokenUserBalance = selector({
    key: "queryDevTokenUserBalance",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const getListedContractQueries = get(getDevTokenContractQuery)
        const address = get(addressState)
        if (getListedContractQueries) {
            return await getListedContractQueries<{ balance: string }[] | undefined>(
                (devToken) => ({
                    contract: devToken,
                    name: devToken,
                    msg: { balance: { address: address } }
                }),
                "queryDevTokenUserBalance"
            )
        }
    },
})

export const findDevTokenUserBalance = selector({
    key: "findDevTokenUserBalance",
    get: async ({ get }) => {
        const list = get(queryDevTokenUserBalance)
        return (lpToken: string | undefined) => {
            // @ts-ignore
            return lpToken && list?.[lpToken] !== undefined ? list[lpToken]?.balance : "0"
        }
    },
})

const devTokenUserBalanceState = atom<Dictionary<{ balance: string }[] | undefined> | any>({
    key: "devTokenInfoState",
    default: undefined,
})

export const useDevTokenUserBalance = () => {
    return useStoreLoadable(queryDevTokenUserBalance, devTokenUserBalanceState)
}

const devTokenInfoState = atom<Dictionary<TokenInfo[] | undefined> | any>({
    key: "devTokenInfoState",
    default: undefined,
})

export const useDevTokenInfo = () => {
    return useStoreLoadable(queryDevTokenInfo, devTokenInfoState)
}

export const useFindDevTokenUserBalance = () => {
    const contents = useDevTokenUserBalance()

    return (devToken: string | undefined) => {
        return devToken && contents?.[devToken] !== undefined ? contents?.[devToken].balance : "0"
    }
}

export const useFindDevTokenSupply = () => {
    const contents = useDevTokenInfo()

    return (devToken: string | undefined) => {
        return devToken && contents?.[devToken] !== undefined ? contents?.[devToken]?.total_supply : "0"
    }
}

export interface DistributableTokensByPool { info: { token: { contract_addr: string } }, daily_reward: string }

const listOfDistributableTokensByPoolState = atom<Dictionary<DistributableTokensByPool[] | undefined> | undefined>({
    key: "listOfDistributableTokensByPoolState",
    default: undefined,
})

/**
 * list Of Distributable Tokens By Pool
 */
export const useListOfDistributableTokensByPool = () => {
    return useStoreLoadable(queryListOfDistributableTokensByPool, listOfDistributableTokensByPoolState)
}

export const useFindlistOfDistributableTokensByPool = () => {
    const contents = useListOfDistributableTokensByPool()

    return (lpToken: string | undefined) => {
        return lpToken && contents?.[lpToken] !== undefined ? contents?.[lpToken] : []
    }
}

export const findListOfDistributableTokensByPool = selector({
    key: "findListOfDistributableTokensByPool",
    get: async ({ get }) => {
        const list = get(queryListOfDistributableTokensByPool)
        return (lpToken: string | undefined) => {
            return lpToken && list?.[lpToken] !== undefined ? list?.[lpToken] : []
        }
    },
})


export const findUserRewardInPool = selector({
    key: "findUserRewardInPool",
    get: async ({ get }) => {
        const queryUserRewards = get(queryUserRewardInPool)
        return (lp: string | undefined) => {
            // @ts-ignore
            return lp && queryUserRewards?.[lp] !== undefined ? queryUserRewards?.[lp].map((item) => item.rewards_info) : []
        }
    },
})


export const useFindUserRewardInPools = () => {
    const queryUserRewards = useFindUserRewardInPool()
    return (lp: string | undefined) => {
        // @ts-ignore
        return lp && queryUserRewards?.[lp] !== undefined ? queryUserRewards?.[lp].map((item) => item.rewards_info) : []
    }
}


export const findDevTokensByLp = selector({
    key: "findDevTokensByLp",
    get: async ({ get }) => {
        const getDevTokens = get(getDevTokensByLp)
        return (lp: string) => {
            return getDevTokens?.[lp] ?? undefined
        }
    },
})

export const useFindDevTokensByLp = () => {
    const getDevTokens = useGetDevTokensByLp()
    return (lp: string) => {
        return getDevTokens?.[lp] ?? undefined
    }
}

export const useFindLPFromDevToken = () => {
    const getDevTokens = useGetDevTokensByLp()
    return (devToken: string) => {
        return Object.keys(getDevTokens).find((item)=>{
            return getDevTokens[item] === devToken
        })
    }
}


export const findLpStakedBalance = selector({
    key: "findLpStakedBalance",
    get: async ({ get }) => {

    },
})

export const getDevTokenContractQuery = selector({
    key: "getDevTokenContractQuery",
    get: ({ get }) => {
        const contracts = get(stakeableList)

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

export const getLpTokenContractQuery = selector({
    key: "getLpTokenContractQuery",
    get: async ({ get }) => {
        const contracts = await get(contractsQuery);

        const getContractQueries = get(getContractQueriesQuery)
            return async <Parsed>(fn: GetDevTokenDocument, name: string) => {
                /*const document =  contracts ? contracts
                    .filter((item) => fn(item.lp))
                    .map((item) => ({ name: fn(item.lp)?.name ?? "NaN", ...fn(item.lp) })) : []

                const list  = await document.map(async (doc) => {
                    //@ts-ignore
                    const item =  await getContractQueries<Parsed>({ contract: doc.contract, msg: doc.msg}, name)
                    return doc.name ? { ...item, token: doc.name } : item
                })
                const dataList:any =  await Promise.all(list)
                return  dataList ? dataList.reduce((acc, item) => ({ ...acc, [item.token]: item}), {}) : {}*/

                const document = alias(
                    contracts
                        .filter((item) => fn(item.lp))
                        .map((item) => ({ name: fn(item.lp)?.name ?? "NaN", ...fn(item.lp) })),
                    name
                )

                return await getContractQueries<Parsed>(document, name)
            }
    },
})

export const lpTokenInfoQuery = selector({
    key: "lpTokenInfoQuery",
    get: async ({ get }) => {
        const getDevTokenContract = get(getDevTokenContractQuery)
        if (getDevTokenContract) {
            return await getDevTokenContract<TokenInfo>(
                (lp: string) => ({ contract: lp, name: lp, msg: { token_info: {} } }),
                "lpTokenInfoQuery"
            )
        }
    },
})

const lpTokenInfoQueryState = atom<any>({
    key: "lpTokenInfoQueryState",
    default: {},
})


export const useLpTokenInfoQuery = () => {
    return useStore(lpTokenInfoQuery, lpTokenInfoQueryState)
}

export const findTokenInfoTotalSupply = selector({
    key: "findTokenInfoTotalSupply",
    get: async ({ get }) => {
        const tokensInfo = await get(lpTokenInfoQuery)
        if (tokensInfo) {
            return (lpToken: string | undefined) => {
                return lpToken ? tokensInfo[lpToken]?.total_supply ?? "0" : "0"
            }
        }
    },
})

/*export const useFindTokenInfoTotalSupply = () => {
    const { contents: tokensInfo} = useLpTokenInfoQuery()
    if (tokensInfo) {
        return (lpToken: string | undefined) => {
            return lpToken ? tokensInfo[lpToken]?.total_supply ?? "0" : "0"
        }
    }
}*/


export const getUserStakedTimeQuery = selector({
    key: "getUserStakedTimeQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const address = get(addressState)
        const getTerraListedContractQueries = get(getContractsLpQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>(
                (lp: string) => ({
                    contract: contracts["loop_farm_staking"],
                    msg: { query_user_staked_time: { pool: lp, wallet: address } },
                    name: lp,
                }),
                "getUserStakedTimeQuery"
            )
        }
    },
})


const getUserStakedTimeQueryState = atom<any>({
    key: "getUserStakedTimeQueryState",
    default: {},
})


export const useGetUserStakedTimeQuery = () => {
    return useStore(getUserStakedTimeQuery, getUserStakedTimeQueryState)
}

export const findUserStakedTime = selector({
    key: "findUserStakedTime",
    get: async ({ get }) => {
        const userStakedTime = await get(getUserStakedTimeQuery)
        if (userStakedTime) {
            return (lpToken: string | undefined) => {
                return lpToken ? userStakedTime[lpToken] ?? "" : ""
            }
        }
    },
})


export const useFindUsersStakedTime = () => {
    const userStakedTime = useGetUserStakedTimeQuery().contents
    if (userStakedTime) {
        return (lpToken: string | undefined) => {
            return lpToken ? userStakedTime[lpToken] ?? "" : ""
        }
    }
}


export const getContractsLpQuery = selector({
    key: "getContractsLpQuery",
    get: ({ get }) => {
        const contracts = get(contractsQuery)
        const getContractQueries = get(getContractQueriesQuery)
        if (contracts) {
            return async <Parsed>(fn: GetDevTokenDocument, name: string) => {
                const document = alias(
                    contracts
                        .filter((item) => fn(item.lp))
                        .map((item) => ({ name: fn(item.lp)?.name ?? "NaN", ...fn(item.lp) })),
                    name
                )

                return await getContractQueries<Parsed>(document, name)
            }
        }
    },
})

export const getDistributionWaitTimeQuery = selector({
    key: "getDistributionWaitTimeQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_farm_staking"],
                msg: { query_distribution_wait_time: {} },
            },
            "getDistributionWaitTimeQuery"
        )
    },
})

export const getLastDistributionNextPayoutQuery = selector({
    key: "getLastDistributionNextPayoutQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_farm_staking"],
                msg: { query_last_distribution_time: {} },
            },
            "getLastDistributionNextPayoutQuery"
        )
    },
})

export const getLockTimeFrameQuery = selector({
    key: "getLockTimeFrameQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_farm_staking"],
                msg: { query_lock_time_frame: {} },
            },
            "getLockTimeFrameQuery"
        )
    },
})

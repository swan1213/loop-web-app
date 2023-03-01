import {atom, selector} from "recoil";
import { protocolQuery } from "../contract/protocol";
import { getContractQueryQuery } from "../utils/query";
import {addressState} from "../wallet";
import {priceKeyIndexState} from "../app";
import {contractsQuery} from "../contract/contract";
import {GetStakingDocument, GetTokenInfoDocument} from "../../types/contract";
import alias from "../contract/alias";
import {getContractQueriesQuery, getListedLpContractQueriesQuery} from "../utils/queries";
import {StakeDuration} from "../../pages/LoopStake";
import {dict} from "../contract/normalize";
import {useStore} from "../utils/loadable";


export enum StakeContracts{
    "12MON" ="loop_staking",
    "18MON" ="loop_staking_18",
    "3MON" ="loop_staking_3",
}

export enum StakeContractsMonth {
    "loop_staking"= "12MON",
    "loop_staking_18" = "18MON",
    "loop_staking_3" = "3MON",
}

export const getTokensDistributedPerDayListQuery = selector({
    key: "getTokensDistributedPerDayListQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getStakingQueriesQuery = get(getStakingQueries)
        return await getStakingQueriesQuery<{ key: string }>(
            (month: string ) => ({ contract: contracts[month], msg: { query_total_daily_reward: {} } }),
            "getTokensDistributedPerDayListQuery"
        )
    },
})

export const getTokensDistributedPerDayLists = selector({
    key: "getTokensDistributedPerDayLists",
    get: async ({ get }) => {
        const result  = get(getTokensDistributedPerDayListQuery)
        return result ? dict(result, (key) => key) : {}
    },
})

export const TokensDistributedPerDayListState = atom({
    key: "TokensDistributedPerDayListState",
    default: {},
})

export const useTokensDistributedPerDayList = () => {
    return useStore(getTokensDistributedPerDayLists, TokensDistributedPerDayListState)
}

/*
export const getTokensDistributedPerDay18MonQuery = selector({
    key: "getTokensDistributedPerDay18MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_18"],
                msg: { query_total_daily_reward: {} },
            },
            "getTokensDistributedPerDay18MonQuery"
        )
    },
})
*/

export const getTotalStakedForStaking18MonQuery = selector({
    key: "getTotalStakedForStaking18MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_18"],
                msg: { query_total_staked:{} },
            },
            "getTotalStakedForStaking18MonQuery"
        )
    },
})

export const deposited18MonQuery = selector({
    key: "deposited18MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const address = get(addressState)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_18"],
                msg: { query_staked_by_user: { wallet: address } },
            },
            "deposited18MonQuery"
        )
    },
})

export const getUserRewards18MonQuery = selector({
    key: "getUserRewards18MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const address = get(addressState)
        const getTerraListedContractQueries = get(getContractQueryQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>({
                    contract: contracts["loop_staking_18"],
                    msg: { query_user_reward: { wallet: address } }
                },
                "getUserRewards18MonQuery"
            )
        }
    },
})


export const getUserStakedTimeforUnstake18MonQuery = selector({
    key: "getUserStakedTimeforUnstake18MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const address = get(addressState)
        const getTerraListedContractQueries = get(getContractQueryQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>({
                    contract: contracts["loop_staking_18"],
                    msg: { query_user_staked_time: { wallet: address } }
                },
                "getUserStakedTimeforUnstake18MonQuery"
            )
        }
    },
})

export const getDistributionWaitTime18MonQuery = selector({
    key: "getDistributionWaitTime18MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getTerraListedContractQueries = get(getContractQueryQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>({
                    contract: contracts["loop_staking_18"],
                    msg: { query_distribution_wait_time:{} }
                },
                "getDistributionWaitTime18MonQuery"
            )
        }
    },
})

export const getLastDistributionTime18MonQuery = selector({
    key: "getLastDistributionTime18MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getTerraListedContractQueries = get(getContractQueryQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>({
                    contract: contracts["loop_staking_18"],
                    msg: { query_last_distribution_time:{} }
                },
                "getLastDistributionTime18MonQuery"
            )
        }
    },
})

export const getLockTimeFrameForUnstake18MonQuery = selector({
    key: "getLockTimeFrameForUnstake18MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_18"],
                msg: { query_lock_time_frame: {} },
            },
            "getLockTimeFrameForUnstake18MonQuery"
        )
    },
})



/*export const getTokensDistributedPerDay3MonQuery = selector({
    key: "getTokensDistributedPerDay3MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_3"],
                msg: { query_total_daily_reward: {} },
            },
            "getTokensDistributedPerDay3MonQuery"
        )
    },
})*/

export const getTotalStakedForStaking3MonQuery = selector({
    key: "getTotalStakedForStaking3MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_3"],
                msg: { query_total_staked:{} },
            },
            "getTotalStakedForStaking3MonQuery"
        )
    },
})

export const deposited3MonQuery = selector({
    key: "deposited3MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const address = get(addressState)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_3"],
                msg: { query_staked_by_user: { wallet: address } },
            },
            "deposited3MonQuery"
        )
    },
})

export const getUserRewards3MonQuery = selector({
    key: "getUserRewards3MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const address = get(addressState)
        const getTerraListedContractQueries = get(getContractQueryQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>({
                    contract: contracts["loop_staking_3"],
                    msg: { query_user_reward: { wallet: address } }
                },
                "getUserRewards3MonQuery"
            )
        }
    },
})


export const getUserStakedTimeforUnstake3MonQuery = selector({
    key: "getUserStakedTimeforUnstake3MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const address = get(addressState)
        const getTerraListedContractQueries = get(getContractQueryQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>({
                    contract: contracts["loop_staking_3"],
                    msg: { query_user_staked_time: { wallet: address } }
                },
                "getUserStakedTimeforUnstake3MonQuery"
            )
        }
    },
})

export const getDistributionWaitTime3MonQuery = selector({
    key: "getDistributionWaitTime3MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getTerraListedContractQueries = get(getContractQueryQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>({
                    contract: contracts["loop_staking_3"],
                    msg: { query_distribution_wait_time:{} }
                },
                "getDistributionWaitTime3MonQuery"
            )
        }
    },
})

export const getLastDistributionTime3MonQuery = selector({
    key: "getLastDistributionTime3MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getTerraListedContractQueries = get(getContractQueryQuery)
        if (getTerraListedContractQueries) {
            return await getTerraListedContractQueries<string | undefined>({
                    contract: contracts["loop_staking_3"],
                    msg: { query_last_distribution_time:{} }
                },
                "getLastDistributionTime3MonQuery"
            )
        }
    },
})

export const getLockTimeFrameForUnstake3MonQuery = selector({
    key: "getLockTimeFrameForUnstake3MonQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_3"],
                msg: { query_lock_time_frame: {} },
            },
            "getLockTimeFrameForUnstake3MonQuery"
        )
    },
})


export const getStakingQueries = selector({
    key: "getStakingQueries",
    get: ({ get }) => {
        const keys  = Object.keys(StakeDuration).map((key) => StakeContracts[key])

        const getContractQueries = get(getContractQueriesQuery)
        return async <Parsed>(fn: GetStakingDocument, name: string) => {
            const document = alias(
                keys ? keys
                    .filter((item) => fn(item))
                    .map((item) => ({ name: item, ...fn(item) })) : [],
                name
            )

            return await getContractQueries<Parsed>(document, name)
        }
    },
})

import { selector } from "recoil"
import { getContractQueryQuery } from "../utils/query"
import {protocolQuery} from "../contract/protocol";

export const getPerDayReward12MonQuery = selector({
    key: "getPerDayReward12MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking"] ?? "",
                msg: {query_total_daily_reward:{} },
            },
            "getPerDayReward12MonQuery"
        )
    },
})

export const getTotalRewardInContract12MonQuery = selector({
    key: "getTotalRewardInContract12MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking"] ?? "",
                msg: {query_total_reward_in_contract:{} },
            },
            "getTotalRewardInContract12MonQuery"
        )
    },
})

export const getTotalReward12MonQuery = selector({
    key: "getTotalReward12MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking"] ?? "",
                msg: {query_total_reward:{} },
            },
            "getTotalReward12MonQuery"
        )
    },
})


export const getPerDayReward18MonQuery = selector({
    key: "getPerDayReward18MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_18"] ?? "",
                msg: {query_total_daily_reward:{} },
            },
            "getPerDayReward18MonQuery"
        )
    },
})

export const getTotalRewardInContract18MonQuery = selector({
    key: "getTotalRewardInContract18MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_18"] ?? "",
                msg: {query_total_reward_in_contract:{} },
            },
            "getTotalRewardInContract18MonQuery"
        )
    },
})

export const getTotalReward18MonQuery = selector({
    key: "getTotalReward18MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_18"] ?? "",
                msg: {query_total_reward:{} },
            },
            "getTotalReward18MonQuery"
        )
    },
})

export const getPerDayReward3MonQuery = selector({
    key: "getPerDayReward3MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_3"] ?? "",
                msg: {query_total_daily_reward:{} },
            },
            "getPerDayReward3MonQuery"
        )
    },
})

export const getTotalRewardInContract3MonQuery = selector({
    key: "getTotalRewardInContract3MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_3"] ?? "",
                msg: {query_total_reward_in_contract:{} },
            },
            "getTotalRewardInContract3MonQuery"
        )
    },
})

export const getTotalReward3MonQuery = selector({
    key: "getTotalReward3MonQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking_3"] ?? "",
                msg: {query_total_reward:{} },
            },
            "getTotalReward3MonQuery"
        )
    },
})


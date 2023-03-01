import { atom, selector } from "recoil"
import { statsURLQuery } from "../network"
import { request } from "graphql-request"
import { CONTRACTS } from "../../graphql/gqldocs"
import { onlyUnique } from "../../libs/parse"
import {useStore} from "../utils/loadable"
import {protocolQuery} from "../contract/protocol";
import {getContractQueryQuery} from "../utils/query";
import {SimulatedData} from "../contract/simulate";
import { VOLUME24HOURS, VOLUME7DAYS, VOLUMETOTAL } from "../../statistics/gqldocs";

export const PairContractsQuery = selector({
    key: "PairContractsQuery",
    get: async ({ get }) => {
        const url = get(statsURLQuery)
        try {
            const result = await request<Dictionary<ContractsType[] | null> | null>(
                url + "?PairContractsQuery",
                CONTRACTS
            )
            return result ? result?.ListedPairs ?? undefined : undefined
        } catch (error) {
            return []
        }
    },
})

export const getListedPairAddrs = selector({
    key: "getListedPairAddrs",
    get: async ({ get }) => {
        const contracts = await get(PairContractsQuery)
        const list = contracts ? contracts.map((item) => item?.['address']).filter(onlyUnique) : []
        return list && list.length > 0 ? list : []
    },
})


export const getListedPairAddrsState = atom<any>({
    key: "getListedPairAddrsState",
    default: {},
})


export const useListedPairAddrs = () => {
    return useStore(getListedPairAddrs, getListedPairAddrsState)
}

/*
export const getTxInfoQuery = selector({
    key: "getTxInfoQuery",
    get: ({ get }) => {
        const { toToken } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)

        return async (params: any) => {
            const { pair, token, amount, reverse } = params
            return await getContractQuery<SimulatedData>(
                {
                    contract: pair,
                    msg: !reverse
                        ? { simulation: { offer_asset: toToken({ token, amount }) } }
                        : { reverse_simulation: { ask_asset: toToken({ token, amount }) } },
                },
                "getTxInfoQuery"
            )
        }
    },
})*/

export const fetch24HourVolume = selector({
    key: "fetch24HourVolume",
    get: async ({ get }) => {
        const url = get(statsURLQuery)
        try {
            const result = await request<Dictionary<ContractsType[] | null> | null>(
                url + "?fetch24HourVolume",
                VOLUME24HOURS
            )
            return result ? result : undefined
        } catch (error) {
            return []
        }
    },
})

export const fetch7DaysVolume = selector({
    key: "fetch7DaysVolume",
    get: async ({ get }) => {
        const url = get(statsURLQuery)
        try {
            const result = await request<Dictionary<ContractsType[] | null> | null>(
                url + "?fetch7DaysVolume",
                VOLUME7DAYS
            )
            return result ? result : undefined
        } catch (error) {
            return []
        }
    },
})

export const fetchtotalVolume = selector({
    key: "fetchtotalVolume",
    get: async ({ get }) => {
        const url = get(statsURLQuery)
        try {
            const result = await request<Dictionary<ContractsType[] | null> | null>(
                url + "?fetchtotalVolume",
                VOLUMETOTAL
            )
            return result ? result : undefined
        } catch (error) {
            return []
        }
    },
})
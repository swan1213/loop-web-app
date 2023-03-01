
import { atom, selector } from "recoil"
import { useStore } from "../utils/loadable"
import { getContractQueryQuery } from "../utils/query"
import { protocolQuery } from "./protocol"

export const latestStageQuery = selector({
    key: "latestStageQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["loop_airdrop"],
                msg: { latest_stage: {} },
            },
            "latestStageQuery"
        )
    },
})

// farming airdrop 2
export const farmAirdrop2StageQuery = selector({
    key: "farmAirdrop2StageQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["farmAirdrop2"] ?? "",
                msg: { latest_stage:{}},
            },
            "farmAirdrop2StageQuery"
        )
    },
})

export const loopAirdrop2StageQuery = selector({
    key: "loopAirdrop2StageQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["loopAirdrop2"] ?? "",
                msg: { latest_stage:{}},
            },
            "loopAirdrop2StageQuery"
        )
    },
})

export const looprAirdrop1StageQuery = selector({
    key: "looprAirdrop1StageQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["looprAirdrop1"] ?? "",
                msg: { latest_stage:{}},
            },
            "looprAirdrop1StageQuery"
        )
    },
})

export const looprAirdrop101StageQuery = selector({
    key: "looprAirdrop101StageQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["looprAirdrop101"] ?? "",
                msg: { latest_stage:{}},
            },
            "looprAirdrop101StageQuery"
        )
    },
})

export const loopAirdropDec21StageQuery = selector({
    key: "loopAirdropDec21StageQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["loopDecember21"] ?? "",
                msg: { latest_stage:{}},
            },
            "loopAirdropDec21StageQuery"
        )
    },
})

export const looprAirdropDec21StageQuery = selector({
    key: "looprAirdropDec21StageQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["looprDecember21"] ?? "",
                msg: { latest_stage:{}},
            },
            "looprAirdropDec21StageQuery"
        )
    },
})

export const loopJanAirdrop22 = selector({
    key: "loopJanAirdrop22",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["loopJanuary22"] ?? "",
                msg: { latest_stage:{}},
            },
            "loopJanAirdrop22"
        )
    },
})
export const loopFebAirdrop22 = selector({
    key: "loopFebAirdrop22",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["loop_feb_22_airdrop"] ?? "",
                msg: { latest_stage:{}},
            },
            "loopFebAirdrop22"
        )
    },
})

const latestStageQueryState = atom<any>({
    key: "latestStageQueryState",
    default: {},
})


export const useLatestStageQuery = () => {
    return useStore(latestStageQuery, latestStageQueryState)
}


export const latestStageFarmingv1AirdropQuery = selector({
    key: "latestStageFarmingv1AirdropQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ latest_stage: number } | undefined>(
            {
                contract: contracts["loop_farming_airdrop"],
                msg: { latest_stage: {} },
            },
            "latestStageFarmingv1AirdropQuery"
        )
    },
})
import { atom, selector } from "recoil"
import { getContractQueryQuery } from "../utils/query"
import { useStore } from "../utils/loadable"
import { iterateAllPage } from "../utils/pagination"
import { protocolQuery } from "./protocol"
import {PAIR} from "../../hooks/useTradeAssets";

export const LIMIT = 15

export const allPairsQuery = selector({
    key: "allPairsQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)

        const query = async (offset?: any[]) => {
            const response = await getContractQuery<{ pairs: PAIR[] } | undefined>(
                {
                    contract: contracts["tokenFactory"],
                    msg: {
                        pairs: {
                            limit: LIMIT,
                            start_after: offset,
                        }
                    }
                },
                ["allPairsQuery", offset].filter(Boolean).join(" - ")
            )

            return response?.pairs ?? []
        }

        return await iterateAllPage(query, (data) => data?.asset_infos, LIMIT)
    },
})

const allPairsQueryState = atom<any[]>({
    key: "allPairsQueryState",
    default: [],
})

export const useLimitOrders = () => {
    return useStore(allPairsQuery, allPairsQueryState)
}
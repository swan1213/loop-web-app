import { selector } from "recoil";
import { protocolQuery } from "../contract/protocol";
import { getContractQueryQuery } from "../utils/query";
import {priceKeyIndexState} from "../app";

export const getTokensDistributedPerDayQuery = selector({
    key: "getTokensDistributedPerDayQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking"],
                msg: { query_total_daily_reward: {} },
            },
            "getTokensDistributedPerDayQuery"
        )
    },
})

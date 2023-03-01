import { selector } from "recoil"
import { getContractQueryQuery } from "../utils/query"
import {protocolQuery} from "./protocol";
import {priceKeyIndexState} from "../app";

export const getTotalStakedForStakingQuery = selector({
  key: "getTotalStakedForStakingQuery",
  get: async ({ get }) => {
      get(priceKeyIndexState)
    const { contracts } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)
    return await getContractQuery<string | undefined>(
        {
          contract: contracts["loop_staking"],
          msg: { query_total_staked:{} },
        },
        "getTotalStakedForStakingQuery"
    )
  },
})

// total accumulated reward
export const totalRewardForStakingQuery = selector({
    key: "totalRewardForStakingQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking"],
                msg: { query_total_reward: {} },
            },
            "totalRewardForStakingQuery"
        )
    },
})
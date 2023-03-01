import {selector} from "recoil"
import {addressState} from "../wallet"
import {priceKeyIndexState} from "../app"
import {protocolQuery} from "../contract/protocol"
import {getDevTokenContractQueryFarm2} from "./FarmV2"

/*export const queryUserRewardInPoolFarm2 = selector({
    key: "queryUserRewardInPoolFarm2",
    get: async ({ get }) => {
        const address = get(addressState)
        get(priceKeyIndexState)
        const {contracts} = get(protocolQuery)
        if (address) {
            const getListedContractQueries = get(getDevTokenContractQueryFarm2(type))
            if (getListedContractQueries) {
                return await getListedContractQueries<{ pool: any; rewards_info: [] } | undefined>(
                    (lp) => ({
                        contract: contracts[type] ?? "",
                        name: lp,
                        msg: {
                            query_user_reward_in_pool: {
                                wallet: address,
                                pool: {token: {contract_addr: lp}},
                            },
                        },
                    }),
                    "queryUserRewardInPoolFarm2"
                )
            }
        }
    }
})*/

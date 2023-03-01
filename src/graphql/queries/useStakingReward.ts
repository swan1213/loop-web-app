
import { useLazyContractQuery } from "../useContractQuery"
import {useProtocol} from "../../data/contract/protocol";

//deleted
export default (address: string) => {
  const { contracts } = useProtocol()
  const variables = {
    contract: contracts["staking"],
    msg: { reward_info: { staker: address } },
  }

  const query = useLazyContractQuery<StakingReward>(variables)
  return query
}

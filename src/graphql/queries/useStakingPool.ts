
import { useLazyContractQueries } from "../useContractQueries"
import {useProtocol} from "../../data/contract/protocol";

//deleted
export default () => {
  const { contracts } = useProtocol()
  const generate = ({ token }: ListedItem) => ({
    contract: contracts["staking"],
    msg: { pool_info: { asset_token: token } },
  })

  const query = useLazyContractQueries<StakingPool>(generate)
  return query
}

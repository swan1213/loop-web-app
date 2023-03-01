import { useContractsAddress } from "../../hooks"
import useContractQuery from "../../graphql/useContractQuery"
import {useProtocol} from "../../data/contract/protocol";

/* hooks */
export default () => {
  const { contracts } = useProtocol()
  const { result, parsed } = useContractQuery<{ total_supply: string }>({
    contract: contracts["loopToken"],
    msg: { token_info: {} },
  })

  return { result, value: parsed?.total_supply }
}

import { LOOP } from "../../constants"
import { useContractsAddress } from "../../hooks"
import { useLazyContractQueries } from "../useContractQueries"
import {useProtocol} from "../../data/contract/protocol";

//deleted
export default () => {
  const { contracts } = useProtocol()
  const generate = ({ token, symbol }: ListedItem) => {
    const variables = {
      contract: contracts["mint"],
      msg: { asset_config: { asset_token: token } },
    }

    return symbol === LOOP ? undefined : variables
  }

  const query = useLazyContractQueries<MintInfo>(generate)
  return query
}

import { LOOP } from "../../constants"
import { useLazyContractQueries } from "../useContractQueries"
import {useProtocol} from "../../data/contract/protocol";

//deleted
export default () => {
  const { contracts } = useProtocol()
  const generate = ({ token, symbol }: ListedItem) => {
    const variables = {
      contract: contracts["oracle"],
      msg: { price: { base_asset: token, quote_asset: "uusd" } },
    }

    return symbol === LOOP ? undefined : variables
  }

  const query = useLazyContractQueries<Rate>(generate)
  return query
}

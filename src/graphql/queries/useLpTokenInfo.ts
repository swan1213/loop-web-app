import { useLazyContractQueries } from "../useContractQueries"

//deleted
export default () => {
  const generate = ({ lpToken }: ListedItem) => {
    return { contract: lpToken, msg: { token_info: {} } }
  }

  const query = useLazyContractQueries<TotalSupply>(generate)
  return query
}

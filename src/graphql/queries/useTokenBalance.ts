import { useLazyContractQueries } from "../useContractQueries"

//deleted
export default (address: string) => {
  const generate = ({ token }: ListedItem) => {
    return { contract: token, msg: { balance: { address } } }
  }

  const query = useLazyContractQueries<Balance>(generate)
  return query
}

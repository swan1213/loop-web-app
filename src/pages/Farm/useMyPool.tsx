import { sum, gt } from "../../libs/math"
import { percent } from "../../libs/num"
import usePool from "../../forms/usePool"
import usePoolShare from "../../forms/usePoolShare"
import {useProtocol} from "../../data/contract/protocol";
import {useFindBalance} from "../../data/contract/normalize";

const useMyPool = () => {
  const { listedAll } = useProtocol()
    const findBalance  = useFindBalance()

  const getPool = usePool()
  const getPoolShare = usePoolShare()

  const dataSource = !listedAll
    ? []
    : listedAll
        .map((item) => {
          const { token } = item
          const balance = findBalance(token) ?? "0"
          const { fromLP } = getPool({ amount: balance, token })
          const poolShare = getPoolShare({ amount: balance, token })
          const { ratio, lessThanMinimum, minimum } = poolShare
          const prefix = lessThanMinimum ? "<" : ""

          return {
            ...item,
            balance,
            withdrawable: fromLP,
            share: prefix + percent(lessThanMinimum ? minimum : ratio),
          }
        })
        .filter(({ balance }) => gt(balance, 0))

  const totalWithdrawableValue = sum(
    dataSource.map(({ withdrawable }) => withdrawable.value)
  )

  return { keys: [], loading: false, dataSource, totalWithdrawableValue }
}

export default useMyPool

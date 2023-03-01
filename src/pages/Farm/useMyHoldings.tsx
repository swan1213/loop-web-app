import { gt, sum, times } from "../../libs/math"
import { useContract } from "../../hooks"
import { PriceKey, BalanceKey } from "../../hooks/contractKeys"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import {useProtocol} from "../../data/contract/protocol";
import {useRecoilValue} from "recoil";
import {findPairPoolPrice} from "../../data/contract/info";
import {useFindBalance} from "../../data/contract/normalize";

const useMyHoldings = () => {
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.TOKEN
  const keys = [priceKey, balanceKey]

  const loading = false
  const { listedAll, getPair } = useProtocol()
  const findPrice  = useRecoilValue(findPairPoolPrice)
  const findBalance  = useFindBalance()
  const { [priceKey]: yesterday } = useYesterday()

  const dataSource = listedAll
        .map((item) => {
          const { token } = item
          const balance = findBalance( token) // balance
          const price = findPrice?.(getPair(token ?? '') ?? '', token)
          const value = times(balance, price)
          const change = calcChange({
            today: price,
            yesterday: yesterday[token],
          })

          return { ...item, balance, price, value, change }
        })
        .filter(({ balance }) => gt(balance, 0))

  const totalValue = sum(dataSource.map(({ value }) => value))

  return { keys, loading, totalValue, dataSource }
}

export default useMyHoldings

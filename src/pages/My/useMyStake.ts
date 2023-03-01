import { SMALLEST, UUSD } from "../../constants"
import { div, gt } from "../../libs/math"
import {
  useFetchTokens,
} from "../../hooks"
import { useFindAPRY } from "../../data/contract/contract"
import { decimal, lookup } from "../../libs/parse"
import {useFarms, useLOOPPrice} from "../../data/contract/normalize"

const useMyStake = () => {
  const list = useFarms()
  const findAPRFn = useFindAPRY()
  // const findTotalStakedByUserFn = useRecoilValue(findTotalStakedByUser)

  const { getStakableLP } = useFetchTokens()
  // todo remove deposited and add total staked by user when implemented
  // const deposited = useRecoilValue(depositedQuery);

  const dataSource = list && list.map((item) => {
    const { lpToken, token, symbol } = item

    // todo remove deposited and add total staked by user when implemented
    //       const staked = lpToken === 'terra1xls75heeu2my6zffjktn87ap6yf4xdtdppjqfq' ? deposited : "0"; //findTotalStakedByUserFn?.(token) ?? undefined
    const staked = "0"; //findTotalStakedByUserFn?.(token) ?? undefined
    const { apr, liqval } = findAPRFn(lpToken)
    const stakable = getStakableLP(lpToken)?.amount ?? "0"
    return {
      token,
      lpToken,
      symbol,
      apr: apr ? div(apr, 100).concat("%") : "0%",
      staked: staked
        ? decimal(lookup(staked, UUSD), 2)
        : "0",
      stakable: div(stakable, SMALLEST) ?? "0",
      liquidity: liqval ? div(liqval, 100000000) : "0",
      reward: "0",
      gov: "0",
    }
  })

  const {contents: price} = useLOOPPrice()

  return {
    loading: !dataSource,
    price: price,
    dataSource: dataSource.filter((item) => gt(item.staked, 0)),
  }
}

export default useMyStake

import { minus, sum } from "../../libs/math"
import useMyHoldings from "./useMyHoldings"
import useMyPool from "./useMyPool"
import useMyStake from "./useMyStake"
import useStaking from "./useStaking";
import {UUSD} from "../../constants";
import {useFindBankBalance} from "../../data/contract/normalize";


const useMy = () => {
  const holdings = useMyHoldings()
  const pool = useMyPool()
  const stake = useMyStake()
  const  staking = useStaking()
  const  findBalance = useFindBankBalance()

  /* total */
  const uusd  = findBalance(UUSD) // uusd balance
  const values = {
    uusd,
    holdings: holdings.totalValue,
    // collateral: mint.totalCollateralValue,
    withdrawble: pool.totalWithdrawableValue,
  }

  const total = { value: calcTotalValue(values), loading: false }

  return { holdings, pool, total, stake , staking}
}

export default useMy

/* calc */
interface Values {
  // uusd: string
  holdings: string
  // minted: string
  // collateral: string
  withdrawble: string
}

export const calcTotalValue = (values: Values) => {
  const { holdings, withdrawble } = values
  // const { uusd, govStaked } = values

  return minus(
    sum([holdings, withdrawble]),
    0
  )
}

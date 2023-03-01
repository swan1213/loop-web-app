import {StakeDuration} from "../LoopStake"
import useStakeList from "../Stake/useStakeList";
import {num, plus} from "../../libs/math";
// import useStakingInfo from "./useStakingInfo" // @todo remove useStakingInfo() file

export interface StakingType {
  nextReward: JSX.Element,
  loopPrice: string | "0",
  total_value: string | "0",
  uusdBalance: string | "0",
  apr: string,
  yourReward: {nextReward: false | JSX.Element, loop: string, ust: string},
  deposited: string,
  staked: string,
  unStakeTimeLeft: {shortMonthsString: string, shortFormatTime: string, shortTimeString: string, time: JSX.Element, shortDayString: string, timeLeft: number},
  tokensDistributedPerDay: string, tvl: string, title: any, loopBalance: string
}

const useStaking = () => {
  // @todo remove useStakingInfo() file
  //@ts-ignore
  const staking12Months: StakingType = useStakeList({ duration: StakeDuration["12MON"], showNextUstReward: false })
  const staking18Months: StakingType = useStakeList({ duration: StakeDuration["18MON"], showNextUstReward: false })
  const staking3Months: StakingType = useStakeList({ duration: StakeDuration["3MON"], showNextUstReward: false })
  const dataSource: StakingType[] = [staking3Months, staking12Months, staking18Months]

  let totalUstBalance = 0
  let totalEarnedFromStaking = 0

  dataSource.map((item) => {
    const { yourReward } = item
    totalUstBalance = num(plus(totalUstBalance, num(item.total_value)));
    totalEarnedFromStaking = num(plus(totalEarnedFromStaking, yourReward.ust))
  })

  return {
    totalUstBalance,
    totalEarnedFromStaking,
    dataSource: dataSource,
  }
}

export default useStaking

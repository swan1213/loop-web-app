import {div, gt, multiple, number, plus} from "../../libs/math"
import {LOOP, SMALLEST, UUSD} from "../../constants"
import {useRecoilValue} from "recoil"
import {StakeDuration} from "../LoopStake"
import {getTotalStakedForStakingQuery} from "../../data/contract/staking"
import {depositedQuery} from "../../data/contract/info"
import {getUserRewardsQuery, getUserStakedTimeforUnstakeQuery} from "../../data/stake/stake"
import {
  deposited18MonQuery,
  deposited3MonQuery,
  getTotalStakedForStaking18MonQuery,
  getTotalStakedForStaking3MonQuery,
  getUserRewards18MonQuery,
  getUserRewards3MonQuery,
  getUserStakedTimeforUnstake18MonQuery,
  getUserStakedTimeforUnstake3MonQuery, StakeContracts, useTokensDistributedPerDayList
} from "../../data/stake/stake18Mon"
import {commas, decimal, numbers_sm} from "../../libs/parse"
import CalculatRewardPerSecond from "./CalculatRewardPerSecond"
import {useFindBalance, useLOOPPrice} from "../../data/contract/normalize"
import useNextDistributionTime from "./useNextDistributionTime"
import styles from "../LoopStake.module.scss"
import useUnstakedTimeoutForStaking from "./useUnstakedTimeoutForStaking"
import {
  getQuery12MONStakedByUser,
  getQuery18MONStakedByUser,
  getQuery3MONStakedByUser
} from "../../data/contract/contract";
import {useProtocol} from "../../data/contract/protocol";


const useStakeList = ({ duration, showNextUstReward = true }:{ duration: StakeDuration, showNextUstReward?: boolean }) => {

  const values:any =  {
    [StakeDuration["12MON"]]:{
      title: "LOOP 12 MONTHS",
      totalTokenStaked: getTotalStakedForStakingQuery,
      deposited: depositedQuery,
      getUserRewardsQuery: getUserRewardsQuery,
      stakedTIme: getUserStakedTimeforUnstakeQuery,
      stakedContract: getQuery12MONStakedByUser,
    },
    [StakeDuration["18MON"]]:{
      title: "LOOP 18 MONTHS",
      totalTokenStaked: getTotalStakedForStaking18MonQuery,
      deposited: deposited18MonQuery,
      getUserRewardsQuery: getUserRewards18MonQuery,
      stakedTIme: getUserStakedTimeforUnstake18MonQuery,
      stakedContract: getQuery18MONStakedByUser,
    },
    [StakeDuration["3MON"]]:{
      title: "LOOP 3 MONTHS",
      totalTokenStaked: getTotalStakedForStaking3MonQuery,
      deposited: deposited3MonQuery,
      getUserRewardsQuery: getUserRewards3MonQuery,
      stakedTIme: getUserStakedTimeforUnstake3MonQuery,
      stakedContract: getQuery3MONStakedByUser,
    }
  }[duration]

  const { getToken } = useProtocol()
  const { contents: loopPrice } = useLOOPPrice();
  const findBalanceFn = useFindBalance()

  const { contents: tokensDistributedPerDayList } = useTokensDistributedPerDayList()
  const totalTokenStaked = useRecoilValue<string | undefined>(values.totalTokenStaked)
  const deposited = useRecoilValue<string | undefined>(values.deposited)
  const staked = useRecoilValue<any>(values.stakedContract)
  const apr = useStakeAPY(duration, div(deposited, SMALLEST),div(totalTokenStaked, SMALLEST))
  const userRewardsQuery = useRecoilValue<string | undefined>(values.getUserRewardsQuery)
  const stakedTIme = useRecoilValue<string | undefined>(values.stakedTIme)
  const {  formatTime: nextFormatTime, timeLeft: nextTimeLeft, timeString: nextTimeString}  = useNextDistributionTime(duration)
  const {  shortFormatTime, timeLeft, shortTimeString, shortMonthsString, shortDayString}  = useUnstakedTimeoutForStaking(stakedTIme ?? "0", duration)


  // @ts-ignore
  const tokensDistributedPerDay: string = tokensDistributedPerDayList[StakeContracts[duration]]
  const loopBalance = div(findBalanceFn(getToken(LOOP)) ?? "0", SMALLEST)
  const uusdBalance = findBalanceFn(UUSD) ?? "0"

  return {
    title: values.title,
    loopPrice,
    loopBalance,
    uusdBalance,
    total_value: commas(decimal(multiple(plus(div(deposited, SMALLEST), decimal(div(userRewardsQuery ?? "0", SMALLEST), 4)), loopPrice), 2)),
    staked: div(staked, SMALLEST),
    deposited: div(deposited, SMALLEST),
    apr: !isFinite(number(apr)) ? "0" : decimal(apr,2),
    tvl: numbers_sm(decimal(div(totalTokenStaked, SMALLEST),2)),
    tokensDistributedPerDay: decimal(div(tokensDistributedPerDay, SMALLEST)),
    nextReward: <CalculatRewardPerSecond showUstValue={showNextUstReward} duration={duration} total_staked={div(totalTokenStaked, SMALLEST)} user_staked={div(deposited, SMALLEST)}/>,
    yourReward: {
      loop: decimal(div(userRewardsQuery ?? "0", SMALLEST), 4),
      ust: decimal(multiple(div(userRewardsQuery ?? "0", SMALLEST), loopPrice), 3),
      nextReward: gt(nextTimeLeft, "0") && (
          <> {nextTimeLeft && nextTimeString.length > 0 ? (
              nextFormatTime && gt(number(nextTimeLeft), "0") ? `${nextFormatTime}` : ""
          ) : (
              <span>(Few days left)</span>
          )}</>
      )
    },
    unStakeTimeLeft: {
      timeLeft,
      shortFormatTime,
      shortTimeString,
      shortMonthsString,
      shortDayString,
      time:  timeLeft && shortTimeString.length > 0 ? (
          <span className={styles.timeLeftSection}>
                                    {shortFormatTime && gt(number(timeLeft), "0") ? `${shortMonthsString ? shortMonthsString+" M" : "0 M" } ${shortDayString ? shortDayString+" D": '0 D'} ${shortFormatTime} m` : ""}
                          </span>
      ) : <span />,
    }
  }
}

export default useStakeList

export function useStakeAPY(duration: StakeDuration, user_staked: string, total_staked: string) {

  const { contents: tokensDistributedPerDayList } = useTokensDistributedPerDayList()
  const tokensDistributedPerDay:any =  tokensDistributedPerDayList[StakeContracts[duration]]

  const { contents } = useLOOPPrice()

  const a = multiple(div(tokensDistributedPerDay, SMALLEST), contents)
  const b = multiple(a,365)
  const tvl = multiple(total_staked, contents)
  return multiple(div(b, tvl), "100")
}
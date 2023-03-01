import { div, minus, multiple, number, plus } from "../../libs/math"
import { commas, decimal, numbers } from "../../libs/parse"
import { LOOP, SMALLEST, UUSD } from "../../constants"
import { useRecoilValue } from "recoil"
import { getTotalStakedForStakingQuery } from "../../data/contract/staking"
import { depositedQuery } from "../../data/contract/info"
import { useEffect, useState } from "react"
import { StakeDuration } from "../LoopStake"
import {
  getUserRewardsQuery,
  getUserStakedTimeforUnstakeQuery,
} from "../../data/stake/stake"
import {
  deposited18MonQuery,
  deposited3MonQuery,
  getTotalStakedForStaking18MonQuery,
  getTotalStakedForStaking3MonQuery,
  getUserRewards18MonQuery,
  getUserRewards3MonQuery,
  getUserStakedTimeforUnstake18MonQuery,
  getUserStakedTimeforUnstake3MonQuery, StakeContracts, useTokensDistributedPerDayList,
} from "../../data/stake/stake18Mon"
import {
  getDistributionWaitTimeQuery,
  getLastDistributionTimeQuery,
} from "../../data/stake/stake"

import { useFindBalance, useLOOPPrice } from "../../data/contract/normalize"
import {
  getQuery12MONStakedByUser,
  getQuery3MONStakedByUser,
  getQuery18MONStakedByUser,
} from "../../data/contract/contract"
import useStakeList from "../Stake/useStakeList";

const useStakingInfo = (duration) => {
  const { tvl, loopBalance, apr } = useStakeList({duration})

  const findBalanceFn = useFindBalance()
  const uusdBalance = findBalanceFn(UUSD) ?? "0"

  const { contents: loopPrice } = useLOOPPrice()
  const { contents: tokensDistributedPerDayList } = useTokensDistributedPerDayList()

  const values: any = {
    [StakeDuration["12MON"]]: {
      title: "LOOP 12 MONTHS",
      totalTokenStaked: getTotalStakedForStakingQuery,
      deposited: depositedQuery,
      getUserRewardsQuery: getUserRewardsQuery,
      stakedTIme: getUserStakedTimeforUnstakeQuery,
      getDistributionWaitTimeQuery: getDistributionWaitTimeQuery,
      getLastDistributionTimeQuery: getLastDistributionTimeQuery,
      stakedContract: getQuery12MONStakedByUser,
    },
    [StakeDuration["18MON"]]: {
      title: "LOOP 18 MONTHS",
      totalTokenStaked: getTotalStakedForStaking18MonQuery,
      deposited: deposited18MonQuery,
      getUserRewardsQuery: getUserRewards18MonQuery,
      stakedTIme: getUserStakedTimeforUnstake18MonQuery,
      getDistributionWaitTimeQuery: getDistributionWaitTimeQuery,
      getLastDistributionTimeQuery: getLastDistributionTimeQuery,
      stakedContract: getQuery18MONStakedByUser,
    },
    [StakeDuration["3MON"]]: {
      title: "LOOP 3 MONTHS",
      totalTokenStaked: getTotalStakedForStaking3MonQuery,
      deposited: deposited3MonQuery,
      getUserRewardsQuery: getUserRewards3MonQuery,
      stakedTIme: getUserStakedTimeforUnstake3MonQuery,
      getDistributionWaitTimeQuery: getDistributionWaitTimeQuery,
      getLastDistributionTimeQuery: getLastDistributionTimeQuery,
      stakedContract: getQuery3MONStakedByUser,
    },
  }[duration]

  const totalTokenStaked = useRecoilValue<string | undefined>(
    values.totalTokenStaked
  )
  const deposited = useRecoilValue<string | undefined>(values.deposited)

  /*const apr = useStakeAPY(
    duration,
    div(deposited, SMALLEST),
    div(totalTokenStaked, SMALLEST)
  )*/
  const userRewardsQuery = useRecoilValue<string | undefined>(
    values.getUserRewardsQuery
  )

  //Reward Calculator

  const tokensDistributedPerDay = tokensDistributedPerDayList[StakeContracts[duration]]
  // console.log("tokensDistributedPerDaytokensDistributedPerDay", tokensDistributedPerDay)
  const getDistributionWaitTime = useRecoilValue<string | undefined>(
    values.getDistributionWaitTimeQuery
  )
  const getLastDistributionTime = useRecoilValue<string | undefined>(
    values.getLastDistributionTimeQuery
  )
  const { contents } = useLOOPPrice()
  const [currentTime, setTime] = useState(div(Date.now(), 1000))

  useEffect(() => {
    const interval = setInterval(() => setTime(div(Date.now(), 1000)), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const perSecondUserReward = multiple(
    div(div(deposited, SMALLEST), div(totalTokenStaked, SMALLEST)),
    div(div(tokensDistributedPerDay, SMALLEST), "86400")
  )
  const remaningTime = minus(
    plus(getDistributionWaitTime, getLastDistributionTime),
    currentTime ?? "0"
  )
  const elapsedTime = minus(getDistributionWaitTime, remaningTime)

  const persecondReward = decimal(multiple(perSecondUserReward, elapsedTime), 6)
  const persecondRewardUST = numbers(
    decimal(multiple(persecondReward, contents), 3)
  )
  const rewardinUst = numbers(
    decimal(multiple(div(userRewardsQuery ?? "0", SMALLEST), loopPrice), 3)
  )

  //Ends here

  const yourReward = numbers(decimal(div(userRewardsQuery ?? "0", SMALLEST), 4))
  const totalBalanceUST = commas(
    decimal(
      multiple(
        plus(div(deposited, SMALLEST), div(userRewardsQuery ?? "0", SMALLEST)),
        loopPrice
      ),
      2
    )
  )

  const staking = div(useRecoilValue<any>(values.stakedContract), SMALLEST)

  const stakingRatio = multiple(div(staking, plus(staking, loopBalance)), "100")

  const dataSource = {
    token: values.title,
    totalTokenStaked: tvl,
    stakeAble: `${loopBalance} ${LOOP}`,
    apr: `${apr} %`,
    persecondReward: `${persecondReward} ${LOOP}`,
    persecondRewardUST: persecondRewardUST,
    totalValue: `${totalBalanceUST}`,
    yourReward: `${yourReward} ${LOOP}`,
    staked: staking,
    rewardinUst: rewardinUst,
    stakingRatio: !isFinite(number(stakingRatio))
      ? "0"
      : decimal(stakingRatio, 2),
    ustBalance: uusdBalance,
  }
  return dataSource
}

export default useStakingInfo

export function useStakeAPY(
  duration: StakeDuration,
  user_staked: string,
  total_staked: string
) {

  const { contents: tokensDistributedPerDayList } = useTokensDistributedPerDayList()
  const tokensDistributedPerDay: any = tokensDistributedPerDayList[StakeContracts[duration]]

  const { contents } = useLOOPPrice()

  const a = multiple(div(tokensDistributedPerDay, SMALLEST), contents)
  const b = multiple(a, 365)
  const tvl = multiple(total_staked, contents)
  return multiple(div(b, tvl), "100")
}

import {useRecoilValue} from "recoil";
import {useEffect, useState} from "react";
import {div, minus, multiple, number, plus} from "../../libs/math";
import {
  getDistributionWaitTimeQuery,
  getLastDistributionTimeQuery,
} from "../../data/stake/stake";
import {LOOP, SMALLEST, UST} from "../../constants";
import {decimal, numbers} from "../../libs/parse";
import {useLOOPPrice} from "../../data/contract/normalize";
import {StakeDuration} from "../LoopStake";
import {
  getDistributionWaitTime18MonQuery,
  getDistributionWaitTime3MonQuery,
  getLastDistributionTime18MonQuery,
  getLastDistributionTime3MonQuery, StakeContracts,
  useTokensDistributedPerDayList
} from "../../data/stake/stake18Mon";

interface Props {
  total_staked: string
  user_staked: string
  duration: StakeDuration
  showUstValue?: boolean
}

const CalculateRewardPerSecond = ({ total_staked, user_staked, duration, showUstValue = true }: Props) => {

  const { contents: tokensDistributedPerDayList } = useTokensDistributedPerDayList()

  const values:any =  {
    [StakeDuration["12MON"]]:{
      getDistributionWaitTimeQuery: getDistributionWaitTimeQuery,
      getLastDistributionTimeQuery: getLastDistributionTimeQuery
    },
    [StakeDuration["18MON"]]:{
      getDistributionWaitTimeQuery: getDistributionWaitTime18MonQuery,
      getLastDistributionTimeQuery: getLastDistributionTime18MonQuery
    },
    [StakeDuration["3MON"]]:{
      getDistributionWaitTimeQuery: getDistributionWaitTime3MonQuery,
      getLastDistributionTimeQuery: getLastDistributionTime3MonQuery
    }
  }[duration]

  // @ts-ignore
  const tokensDistributedPerDay: string = tokensDistributedPerDayList[StakeContracts[duration]]

  const getDistributionWaitTime = useRecoilValue<string|undefined>(values.getDistributionWaitTimeQuery)
  const getLastDistributionTime = useRecoilValue<string|undefined>(values.getLastDistributionTimeQuery)
  const { contents } = useLOOPPrice()
  const [currentTime, setTime] = useState(div(Date.now(), 1000));

  useEffect(() => {
    const interval = setInterval(() => setTime(div(Date.now(), 1000)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);


  const perSecondUserReward = multiple(div(user_staked, total_staked), div(div(tokensDistributedPerDay, SMALLEST), "86400"))
  const remaningTime = minus(plus(getDistributionWaitTime, getLastDistributionTime), currentTime ?? "0")
  const elapsedTime = minus(getDistributionWaitTime, remaningTime)

  const persecondReward = decimal(multiple(perSecondUserReward, elapsedTime), 6)
  const persecondRewardUST = numbers(decimal(multiple(persecondReward, contents), 3))

  return (
      <>
        {!isNaN(number(persecondReward ?? "0")) && isFinite(number(persecondReward ?? "0")) ? numbers(persecondReward) ?? "0" : "0"} <span>{LOOP}</span>
        { showUstValue && <i>{!isNaN(number(persecondRewardUST ?? "0")) && isFinite(number(persecondRewardUST ?? "0")) ? numbers( persecondRewardUST ?? "0") : "0"} {UST}</i> }
      </>
)
}

export default CalculateRewardPerSecond
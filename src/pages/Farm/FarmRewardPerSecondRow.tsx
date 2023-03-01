import {TokenInfo, useGetTokenInfoQuery, useTokenMethods,} from "../../data/contract/info"
import {useRecoilValue} from "recoil"
import {FarmReward} from "./FarmRewards"
import {adjustAmount, commas, decimal, isNative, lookupSymbol,} from "../../libs/parse"
import {SMALLEST} from "../../constants"
import {div, minus, multiple} from "../../libs/math"
import styles from "./FarmRewards.module.scss"
import {
  findDevTokenUserBalance,
  getDistributionWaitTimeQuery,
  useFindDevTokenUserBalance
} from "../../data/farming/stakeUnstake"
import useRewardNextPayout, {useRewardNextPayoutFarm2} from "../../graphql/queries/Farm/useRewardNextPayout"
import {
  FarmContractTYpe,
  getDistributionWaitTimeQueryFarm2,
  useFindDevTokensByLpFarm2,
  useFindStakedByUserFarmQueryFarm2,
  useTotalStakedForFarming
} from "../../data/farming/FarmV2"
import useContractQuery from "../../graphql/useContractQuery"
import {getTotalStakedForFarming4Query, useFindStakedByUserFarmQueryFarm4} from "../../data/contract/migrate";

interface Props {
  item: FarmReward
  lp: string
  farmContractType: FarmContractTYpe
}

const FarmRewardPerSecondRow = ({ item, lp }: Props) => {
  const getTokenInfoFn = useGetTokenInfoQuery()
  const getDistributionWaitTime = useRecoilValue(getDistributionWaitTimeQuery)
  const { check8decOper } = useTokenMethods()
  const { info, daily_reward } = item
  const token = info.token !== undefined ? info.token.contract_addr : ""
  const contractSymbol =
    info.token !== undefined
      ? getTokenInfoFn?.(info.token.contract_addr)?.symbol
      : "";

    const findDevTokenSupply = useRecoilValue(findDevTokenUserBalance)
  const findDevTokenBalance = useFindDevTokenUserBalance()
  const perDayReward = check8decOper(info.token?.contract_addr)
      ? decimal(adjustAmount(true, false, daily_reward), 6)
      : decimal(div(daily_reward, SMALLEST), 6)
  const totalSuppply = lp ? findDevTokenSupply(lp) : "0"
  const perDev = div(perDayReward, totalSuppply)
  const userBalance  = findDevTokenBalance(lp)
  const userPerDevRewrd = multiple(userBalance, perDev)
  const perSecond = div(userPerDevRewrd, "86400")
  const { timeLeft } = useRewardNextPayout()
  const elapsedTime = minus(getDistributionWaitTime ?? "21600", timeLeft)
  const persecondReward = multiple(perSecond, elapsedTime)
  return (
    <div className={styles.row}>
      <span className={styles.price}>
        {commas(decimal(persecondReward, 6))}{" "}
      </span>
      <span>
        {" "}
        {isNative(token)
          ? ` ${lookupSymbol(token)}`
          : ` ${lookupSymbol(contractSymbol)}`}
      </span>
    </div>
  )
}

export default FarmRewardPerSecondRow

export const FarmRewardPerSecondRowFarm2 = ({ item, lp, farmContractType }: Props) => {
  const findStakedByUserFarmFn = useFindStakedByUserFarmQueryFarm2(farmContractType)
  const getDistributionWaitTimeV2 = useRecoilValue(getDistributionWaitTimeQueryFarm2(farmContractType))
  const getTokenInfoFn = useGetTokenInfoQuery()
  const { info, daily_reward } = item
  const token = info.token !== undefined ? info.token.contract_addr : ""
  const contractSymbol =
      info.token !== undefined
          ? getTokenInfoFn?.(info.token.contract_addr)?.symbol
          : "";
  const { check8decOper } = useTokenMethods()
  const findDevTokensByLpFarm2 = useFindDevTokensByLpFarm2(farmContractType)
  const devToken = findDevTokensByLpFarm2(lp)
  const devTokenInfo = useDevTokenInfo(devToken)
  const perDayReward = check8decOper(info.token?.contract_addr)
      ? decimal(adjustAmount(true, false, daily_reward), 6)
      : decimal(div(daily_reward, SMALLEST), 6)
  const totalSuppply = lp ? div(devTokenInfo?.total_supply, SMALLEST) : "0"
  const totalHours = div("86400", getDistributionWaitTimeV2)
  const perDev = div(multiple(perDayReward, totalHours ?? "4"), totalSuppply)
  const staked = findStakedByUserFarmFn(lp)
  const userPerDevRewrd = multiple(div(staked, SMALLEST), perDev)
  const perSecond = div(userPerDevRewrd, "86400")
  const { timeLeft } = useRewardNextPayoutFarm2(farmContractType)
  const elapsedTime = minus(getDistributionWaitTimeV2 ?? "21600", timeLeft)
  const persecondReward = multiple(perSecond, elapsedTime)
  return (
      <div className={styles.row}>
      <span className={styles.price}>
        {commas(decimal(persecondReward, 6))}{" "}
      </span>
        <span>
        {" "}
          {isNative(token)
              ? ` ${lookupSymbol(token)}`
              : ` ${lookupSymbol(contractSymbol)}`}
      </span>
      </div>
  )
}


export const FarmRewardPerSecondRowFarm4 = ({ item, lp, farmContractType }: Props) => {
  const findStakedByUserFarmFn = useFindStakedByUserFarmQueryFarm2(farmContractType)
  const findStakedByUserFarm4Fn = useFindStakedByUserFarmQueryFarm4()
  const getDistributionWaitTimeV2 = useRecoilValue(getDistributionWaitTimeQueryFarm2(farmContractType))

  const getTokenInfoFn = useGetTokenInfoQuery()
  const { info, daily_reward } = item
  const token = info.token !== undefined ? info.token.contract_addr : ""
  const contractSymbol =
      info.token !== undefined
          ? getTokenInfoFn?.(info.token.contract_addr)?.symbol
          : "";
  const { check8decOper } = useTokenMethods()
  const total_stakedListFarm4 = useRecoilValue(getTotalStakedForFarming4Query(farmContractType))
  const { contents: findTotalStakedList } = useTotalStakedForFarming(farmContractType)
  const findTotalStakedForFarming = farmContractType === FarmContractTYpe.Farm4 ? total_stakedListFarm4?.[lp] ?? "0" : findTotalStakedList?.[lp] ?? "0"

  const perDayReward = check8decOper(info.token?.contract_addr)
      ? decimal(adjustAmount(true, false, daily_reward), 6)
      : decimal(div(daily_reward, SMALLEST), 6)

  const totalSuppply = lp && findTotalStakedForFarming ? div(findTotalStakedForFarming ?? "0", SMALLEST) : "0"
  const totalHours = div("86400", getDistributionWaitTimeV2)
  const perDev = div(multiple(perDayReward, totalHours ?? "4"), totalSuppply)
  const staked = farmContractType === FarmContractTYpe.Farm4 ? findStakedByUserFarm4Fn(lp) ?? "0" : findStakedByUserFarmFn(lp) ?? "0"
  const userPerDevRewrd = multiple(div(staked, SMALLEST), perDev)
  const perSecond = div(userPerDevRewrd, "86400")
  const { timeLeft } = useRewardNextPayoutFarm2(farmContractType)
  const elapsedTime = minus(getDistributionWaitTimeV2 ?? "21600", timeLeft)
  const persecondReward = multiple(perSecond, elapsedTime)
  return (
      <div className={styles.row}>
      <span className={styles.price}>
        {commas(decimal(persecondReward, 6))}{" "}
      </span>
        <span>
        {" "}
          {isNative(token)
              ? ` ${lookupSymbol(token)}`
              : ` ${lookupSymbol(contractSymbol)}`}
      </span>
      </div>
  )
}

const useDevTokenInfo = (devToken: string | undefined) => {
  const variables = {
    contract: devToken ?? "",
    msg: { token_info: {} },
  }

  const query = useContractQuery<TokenInfo>(variables)
  return query.parsed as TokenInfo
}


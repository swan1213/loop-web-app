import {
    useGetTokenInfoQuery, useTokenMethods,
} from "../../data/contract/info"
import { FarmReward } from "./FarmRewards"
import {
    adjustAmount, commas,
    decimal,
    isNative,
    lookupSymbol, numbers,
} from "../../libs/parse"
import { SMALLEST } from "../../constants"
import {div, multiple} from "../../libs/math"
import styles from "./FarmRewards.module.scss"
import {useRecoilValue} from "recoil";
import {FarmContractTYpe, getDistributionWaitTimeQueryFarm2} from "../../data/farming/FarmV2";

interface Props {
  item: FarmReward
}

const FarmRewardsRow = ({ item }: Props) => {
  const getTokenInfoFn = useGetTokenInfoQuery()
  const { info } = item
  const token = info.token !== undefined ? info.token.contract_addr : ""
  const contractSymbol =
    info.token !== undefined
      ? getTokenInfoFn?.(info.token.contract_addr)?.symbol
      : ""

  return (
    <div className={styles.row}>
      <span className={styles.price}>
        {`0`}{" "}
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

export default FarmRewardsRow

export const FarmRewardsRowFarm2 = ({ item, farmType }: { farmType: FarmContractTYpe, item: FarmReward }) => {
    const getTokenInfoFn = useGetTokenInfoQuery()
    const { info } = item
    const token = info.token !== undefined ? info.token.contract_addr : ""
    const contractSymbol =
        info.token !== undefined
            ? getTokenInfoFn?.(info.token.contract_addr)?.symbol
            : ""
    const totalHours = useFarmRewardsRowFarm2(item, farmType)
    const adminRestriction=window.location.href.includes("admin")

    return (
        <div className={styles.row}>
      <span className={styles.price}>
        {adminRestriction &&`${commas(totalHours)}  `}{" "}
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
export const useFarmRewardsRowFarm2 = (item: FarmReward, farmType: FarmContractTYpe) => {
    const { check8decOper } = useTokenMethods()
    const getDistributionWaitTimeV2 = useRecoilValue(getDistributionWaitTimeQueryFarm2(farmType))

    const { info, daily_reward } = item
    const totalHours = div("86400", getDistributionWaitTimeV2)

    const reward = check8decOper(info.token.contract_addr)
        ? decimal(adjustAmount(true, false, daily_reward), 6)
        : decimal(div(daily_reward, SMALLEST), 6)
    return decimal(multiple(reward, totalHours), 2)
}

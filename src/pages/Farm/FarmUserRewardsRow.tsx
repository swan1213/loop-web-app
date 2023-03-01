import {
    getTokenInfoQuery, useTokenMethods
} from "../../data/contract/info"
import {
    adjustAmount, commas,
    decimal,
    isNative,
    lookupSymbol,
} from "../../libs/parse"
import {SMALLEST, UST} from "../../constants"
import { div } from "../../libs/math"
import styles from "./FarmRewards.module.scss"
import { FarmUserRewardType }  from "./FarmUserRewards"
import {useRecoilValue} from "recoil";

interface Props {
  item: FarmUserRewardType
}

const FarmRewardsRow = ({ item }: Props) => {
  const getTokenInfoFn = useRecoilValue(getTokenInfoQuery)
    const { check8decOper } = useTokenMethods()
  const { info, amount } = item
  const token = info.token !== undefined ? info.token.contract_addr : info.nativeToken.denom
  const contractSymbol = info.token !== undefined
      ? getTokenInfoFn?.(info.token.contract_addr)?.symbol
      : ""
  return (
    <div className={styles.row}>
      <span className={styles.price}>
        {`${
            commas(check8decOper(info.token?.contract_addr)
            ? decimal(adjustAmount(true, false, amount), 6)
            : decimal(div(amount, SMALLEST), 6))
        }  `}{" "}
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

export const FarmRewardsRowFarm2 = ({ item }: Props) => {
    const getTokenInfoFn = useRecoilValue(getTokenInfoQuery)
    const { check8decOper } = useTokenMethods()
    const { info, amount } = item
    const token = info.token !== undefined ? info.token.contract_addr : info.nativeToken.denom
    const contractSymbol = info.token !== undefined
        ? getTokenInfoFn?.(info.token.contract_addr)?.symbol
        : ""
    return (
        <div className={styles.row}>
      <span className={styles.price}>
        {`${commas(check8decOper(info.token?.contract_addr)
            ? decimal(adjustAmount(true, false, amount), 6)
            : decimal(div(amount, SMALLEST), 6))}  `}{" "}
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


import styles from "./PortFolioAllAssets.module.scss"
import COINS_ICON from "../../images/coins_icon.svg"
import useMy from "../../pages/My/useMy"
import { useFarmsList } from "../../pages/Farm/useFarmBetaList"
import { div, gt, multiple, plus } from "../../libs/math"
import { SMALLEST } from "../../constants"
import { commas, decimal } from "../../libs/parse"
import { useLOOPPrice } from "../../data/contract/normalize"
import { useRewardsInUst } from "../../data/farming/Main"
import { FarmContractTYpe } from "../../data/farming/FarmV2"

const useFarmTotalValueUstLocked = ():string => {
  const dataList = useFarmsList(true)

  const  list =  dataList &&
  dataList.length > 0 ?
      dataList
          ?.filter((farm) => gt(farm.staked ?? "0", "0"))
          ?.map((farm) => {
            return farm?.tvl ?? "0"
          }) : []
  return list && list?.reduce((a, b) => plus(a, b))
}

const PortFolioAllAssets = () => {
  const { holdings, pool, staking } = useMy()
  let farmStaking: string = "0"
  let farmRewards: string =  useFarmTotalValueUstLocked()

  const holdingsValue = div(holdings?.totalValue, SMALLEST)
  const poolValue = pool?.totalWithdrawableValue
  const stakeValue = farmStaking
  const stakingValue = staking?.totalUstBalance
  const totalEarnedFromStaking = staking?.totalEarnedFromStaking.toString()

  const totalBalance = decimal(
    plus(plus(holdingsValue, poolValue), plus(stakeValue, stakingValue)),
    2
  )

  return (
    <div className={styles.assetsContainer}>
      <div className={styles.imageWrapper}>
        <span className={styles.coinImage}>
          <img src={COINS_ICON} />
        </span>
      </div>
      <div className={styles.valuesContainer}>
        <span className={styles.itemWrapper}>
          <span>Total Balance</span>
          <span className={styles.dflex}>
            <span className={styles.textStyle}>{commas(totalBalance)}</span>
            <span className={styles.Style}>UST</span>
          </span>
        </span>

        <span className={styles.itemWrapper}>
          <span>Total Earned From Loop Protocol</span>
          <span className={styles.dflex}>
            <span className={styles.textStyle}>{decimal(plus(farmRewards ?? "0", commas(totalEarnedFromStaking) ?? "0"),2)}</span>
            <span className={styles.Style}>UST</span>
          </span>
        </span>

        <span className={styles.itemWrapper}>
          <span>7 Days Change</span>
          <span className={styles.dflex}>
            <span className={styles.textStyle}>Comming Soon</span>
            {/* <span className={styles.Style}>UST</span> */}
          </span>
        </span>
      </div>
    </div>
  )
}

export default PortFolioAllAssets

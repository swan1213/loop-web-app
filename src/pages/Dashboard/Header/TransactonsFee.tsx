import { bound } from "../../../components/Boundary"
import styles from "../DashboardHeader.module.scss"
import LoadingPlaceholder from "../../../components/Static/LoadingPlaceholder"
import Count from "../../../components/Count"
import { SMALLEST, UST } from "../../../constants"
import { useTotalVolume } from "../../../data/contract/statistic"
import { div, gt, multiple } from "../../../libs/math"

const useTransactionsFee = () => {
  const totalVolume = useTotalVolume()

  return {
    totalVolume:  totalVolume ?? "0",
  }
}

const TransactionsFee = () => {
  const { totalVolume  } = useTransactionsFee()

  return bound(
    gt(multiple(totalVolume, 0.003), "0") ? (
      <>
        <Count
          symbol={UST}
          className={styles.count}
          priceClass={styles.price}
        >
          {multiple(totalVolume, 0.003)}
        </Count>
        <span className={styles.footer}>
          <Count>
            {multiple(
              multiple(div(totalVolume, SMALLEST), 0.003),
              0.3
            )}
          </Count>{" "}
          <span className={styles.label} style={{paddingLeft:'4px'}}>to LOOP Stakers</span>
        </span>
        <span className={styles.footer}>
          <Count>
            {multiple(
              multiple(div(totalVolume, SMALLEST), 0.003),
              0.7
            )}
          </Count>{" "}
          <span className={styles.label} style={{paddingLeft:'4px'}}>to LP Providers</span>
        </span>
      </>
    ) : (
      <LoadingPlaceholder className={styles.loading} size={"sm"} color={"lightGrey"} />
    ),
    <LoadingPlaceholder className={styles.loading} size={"sm"} color={"lightGrey"} />
  )
}

export default TransactionsFee

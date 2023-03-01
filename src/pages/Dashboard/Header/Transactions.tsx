import { bound } from "../../../components/Boundary"
import styles from "../DashboardHeader.module.scss"
import LoadingPlaceholder from "../../../components/Static/LoadingPlaceholder"
import Count from "../../../components/Count"
import useDashboard, { StatsNetwork } from "../../../statistics/useDashboard"
import { gt } from "../../../libs/math"

const useTransactions = () => {
  const { dashboard } = useDashboard(StatsNetwork.TERRA)
  return {
    latest24h: dashboard ? dashboard.latest24h : undefined
  }
}

const Transactions = () => {
  const { latest24h } = useTransactions()

  return bound(gt(latest24h?.transactions ?? "0", "-1") ? (
    <span className={styles.dflex}>
      <Count
        integer
        className={styles.count}
        priceClass={styles.price}
      >
        {latest24h?.transactions}
      </Count>
      <span className={styles.transactionDays}> 7 Days </span>
    </span>
  ) : (
    <LoadingPlaceholder size={"sm"} color={"black"} />
  ),
  <LoadingPlaceholder size={"sm"} color={"black"} />
  )
}

export default Transactions

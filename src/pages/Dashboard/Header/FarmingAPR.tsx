import { bound } from "../../../components/Boundary"
import { useAprRanges } from "../helper"
import styles from "../DashboardHeader.module.scss"
import LoadingPlaceholder from "../../../components/Static/LoadingPlaceholder"

const useFarmingAPR = () => {
  const dashboard_apr = useAprRanges()

  return {
    max_apr:  dashboard_apr ? Math.max(...dashboard_apr) : '',
    min_apr:  dashboard_apr ? Math.min(...dashboard_apr) : '',
    loading: dashboard_apr?.length < 0
  }
}

const FarmingAPR = () => {
  const { max_apr, min_apr, loading } = useFarmingAPR()

  return bound(!loading && (
      <span className={styles.dflex}>
        <span className={styles.aprRange}>{min_apr}</span>
        <span>%</span>
        <span className={styles.seprate}> - </span>
        <span className={styles.aprRange}>{max_apr}</span>
        <span>%</span>
      </span>
    ),
    <LoadingPlaceholder size={"sm"} color={"black"} />
  )
}

export default FarmingAPR

import { bound } from "../../../components/Boundary"
import styles from "../DashboardHeader.module.scss"
import Count from "../../../components/Count"
import { useRecoilValue } from "recoil"
import { fetch24HourVolume, fetch7DaysVolume, fetchtotalVolume } from "../../../data/stats/contracts"
import { UST } from "../../../constants"

const useVolume = () => {
  const last24HourVolume: any = useRecoilValue(fetch24HourVolume)
  const last7DayVolume:any = useRecoilValue(fetch7DaysVolume)
  const VolumeTotal:any = useRecoilValue(fetchtotalVolume)

  return {
    last24HourVolume,
    last7DayVolume,
    VolumeTotal
  }
}
const Volume = () => {
  const {VolumeTotal, last24HourVolume, last7DayVolume} = useVolume()
  return bound(
    <>
      <span className={styles.dflex}>
        <span className={styles.volumetitle}>24Hour </span>
        <span className={styles.volume}>
          <Count>{last24HourVolume?.last24HoursVolume}</Count>
        </span>
        <span className={styles.volumeLabel}>{UST}</span>
      </span>
      <span className={styles.dflex}>
        <span className={styles.volumetitle}>7 Days </span>
        <span className={styles.volume}>
          <Count>{last7DayVolume?.last7DaysVolume}</Count>
        </span>
        <span className={styles.volumeLabel}>{UST}</span>
      </span>
      <span className={styles.dflex}>
        <span className={styles.volumetitle}>Total</span>
        <span className={styles.volume}>
          <Count>{VolumeTotal?.totalVolume}</Count>
        </span>
        <span className={styles.volumeLabel}>{UST}</span>
      </span>
    </>
  )
}

export default Volume

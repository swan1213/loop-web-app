import { bound } from "../../../components/Boundary"
import { useEffect, useState } from "react"
import moment from "moment"
import styles from "../DashboardHeader.module.scss"

const FarmingRunway = () => {
  const [farmingRunway,setFarmingRunway]=useState(0);

  useEffect(()=>{
    const a = moment();
  const b = moment([2022, 0, 4])
  const daysPassed=a.diff(b, 'days')
  setFarmingRunway(daysPassed)
  },[])

  return <>
      <span className={styles.dflex}>
        <span className={styles.aprRange}>{farmingRunway}</span>
        <span className={styles.seprate}>Days</span>
      </span>
    </>
}

export default FarmingRunway
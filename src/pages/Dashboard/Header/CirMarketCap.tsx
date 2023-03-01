import { useRecoilValue } from "recoil"

import { bound } from "../../../components/Boundary"
import styles from "../DashboardHeader.module.scss"
import LoadingPlaceholder from "../../../components/Static/LoadingPlaceholder"
import { commas, decimal } from "../../../libs/parse"
import { getCirMarketCap } from "../../../data/contract/statistic"
import { multiple, gt } from "../../../libs/math"
import { useLOOPPrice } from "../../../data/contract/normalize"

export const useMarketCap = () => { 
    const content = useRecoilValue(getCirMarketCap)
    return content ? content?.data[0]?.circulatingSupply : "0"
}

const CirMarketCap = () => {

  const loopSupply = useMarketCap()
  const LoopUstPrice = useLOOPPrice()?.contents ?? "0"

  return bound( (loopSupply && gt(LoopUstPrice, "0")) && (
      <>
        <span className={styles.dflex}>
          <span className={styles.aprRange}>{commas(decimal(multiple(parseFloat(loopSupply && loopSupply?.replace(/,/g, '')),LoopUstPrice),2))}</span>
          <span className={styles.seprate}>UST</span>
        </span>
        <span className={styles.footer}>2.03b Fully Diluted</span>
      </>
    ),
    <LoadingPlaceholder size={"sm"} color={"black"} />
  )
}

export default CirMarketCap


export const CirculatingSupply = () => {

  const loopSupply = useMarketCap()

  return bound(
    loopSupply && (
      <>
        <span className={styles.dflex}>
          <span className={styles.aprRange}>{loopSupply}</span>
          <span className={styles.seprate}>LOOP</span>
        </span>
        <span className={styles.footer}>of 1b total</span>
      </>
    ),
    <LoadingPlaceholder size={"sm"} color={"black"} />
  )
}

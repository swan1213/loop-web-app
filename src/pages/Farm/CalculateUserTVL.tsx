import {plus} from "../../libs/math";
import {commas, decimal} from "../../libs/parse";
import {UST} from "../../constants";
import styles from "../../components/FarmStake.module.scss"

const CalculateTVL = ({ tvl }: {
  tvl: string
  // user_rewards:  DistributableTokensByPool[] | undefined
}) => {
  // const price = useCalculateUserPrice(user_rewards)
  // const calPrice = price.flat() && price.flat().length > 0 ? price.flat().reduce((a, b) => plus(a, b)) : "0"
  return (
    <div className={styles.price}>
      <span className={styles.value}>{ commas(decimal(plus(tvl),2))}</span> { UST }
    </div>
  )
}

export default CalculateTVL

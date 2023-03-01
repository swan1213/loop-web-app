import {useRecoilValue} from "recoil"

import {commas, decimal} from "../../libs/parse"
import {div} from "../../libs/math"
import {depositedQuery} from "../../data/contract/info"
import {getTotalStakedForStakingQuery} from "../../data/contract/staking"
import {useStakeAPY} from "./useStakeList"
import {SMALLEST} from "../../constants"
import {
  deposited18MonQuery,
  deposited3MonQuery,
  getTotalStakedForStaking18MonQuery,
  getTotalStakedForStaking3MonQuery
} from "../../data/stake/stake18Mon";
import {CardPlaceholder, StakeDuration} from "../LoopStake"
import {useLOOPPrice} from "../../data/contract/normalize"
import Summary from "../../components/Summary"
import styles from "../LoopStake.module.scss"
import iconLogo2 from "../../images/icons/totalProfit.svg"
import {TooltipIcon} from "../../components/Tooltip"

import Card from "../../components/Card"
import {bound} from "../../components/Boundary"

const StakeCards = () => {

  const { contents: loopPrice } = useLOOPPrice();

  // 12 months
  const deposited12Mon = useRecoilValue(depositedQuery)
  const totalTokenStaked = useRecoilValue(getTotalStakedForStakingQuery)
  const apr = useStakeAPY(StakeDuration['12MON'],div(deposited12Mon, SMALLEST),div(totalTokenStaked, SMALLEST))

  // 18 month
  const deposited18Mon = useRecoilValue(deposited18MonQuery)
  const getTotalStakedForStaking18Mon = useRecoilValue(getTotalStakedForStaking18MonQuery)
  const apr18Mon = useStakeAPY(StakeDuration['18MON'],div(deposited18Mon, SMALLEST),div(getTotalStakedForStaking18Mon, SMALLEST))

  // 3 month
  const deposited3Mon = useRecoilValue(deposited3MonQuery)
  const getTotalStakedForStaking3Mon = useRecoilValue(getTotalStakedForStaking3MonQuery)
  const apr3Mon = useStakeAPY(StakeDuration['3MON'],div(deposited3Mon, SMALLEST),div(getTotalStakedForStaking3Mon, SMALLEST))

  const cards = [
    <Summary
        labelClassName={styles.label}
        icon={iconLogo2}
        title={
          <TooltipIcon
              className={styles.tooltipNew}
              content="12 Month APR"
          >
            12 Month APR
          </TooltipIcon>
        }
    >
      <span className={styles.count}>{commas(decimal(apr,2))}</span>
      <span className={styles.price}>%</span>
    </Summary>,
    <Summary
        labelClassName={styles.label}
        icon={iconLogo2}
        title={
          <TooltipIcon
              className={styles.tooltipNew}
              content="18 Month APR"
          >
            18 Month APR
          </TooltipIcon>
        }
    >
      <span className={styles.count}>{commas(decimal(apr18Mon,2))}</span>
      <span className={styles.price}>%</span>
    </Summary>,
    <Summary
        labelClassName={styles.label}
        icon={iconLogo2}
        title={
          <TooltipIcon
              className={styles.tooltipNew}
              content="3 Month APR"
          >
            3 Month APR
          </TooltipIcon>
        }
    >
      <span className={styles.count}>{commas(decimal(apr3Mon,2))}</span>
      <span className={styles.price}>%</span>
    </Summary>,
    <Summary
        labelClassName={styles.label}
        icon={iconLogo2}
        title={
          <TooltipIcon
              className={styles.tooltipNew}
              content="Current LOOP Price"
          >
            LOOP Price
          </TooltipIcon>
        }
    >
      <span className={styles.count}>{decimal(loopPrice, 3)}</span>
      <span className={styles.price}>UST</span>
    </Summary>
  ]

  return <>
    {
      bound(cards.map((content) => {
      return <Card className={styles.card}>
        {bound(content, <CardPlaceholder/>)}
      </Card>
      }), CardPlaceholder)
    }
  </>
}

export default StakeCards

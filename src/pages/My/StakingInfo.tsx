import Tooltip from "../../lang/Tooltip.json"
import { UUSD, UST, LOOP } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import {decimal, lookupSymbol} from "../../libs/parse"
import Card from "../../components/Card"
import Table from "../../components/Table"
import { Di } from "../../components/Dl"
import { TooltipIcon } from "../../components/Tooltip"
import styles from "./Staking.module.scss"
import Price from "../../components/Price"
import { Grid } from "@material-ui/core"
import { bound } from "../../components/Boundary"
import Loop_icon from "../../images/coins/loop_icon.svg"
import { Link } from "react-router-dom"
import "../Stake/StakeList.module.scss"
import {div, gt, multiple, number, plus} from "../../libs/math"
import useStaking from "./useStaking"

const StakingInfo = () => {
    const  { dataSource, totalUstBalance, totalEarnedFromStaking  } = useStaking()

  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>
      <Price
        price={!isFinite(number(value)) ? "0" : decimal(value.toString(), 2)}
        symbol={lookupSymbol(UUSD)}
      />
    </TooltipIcon>
  )

  const data= dataSource.filter((data) => gt(data.staked, 0))
  const dataExists = !!data.length

  const description = dataExists && (
    <div className={styles.d_flex}>
      <span className={styles.p_right}>
        <Di
          title="Total Earned From Staking"
          className={styles.withDrawableValue}
          content={renderTooltip(
            totalEarnedFromStaking.toString(),
            Tooltip.My.TotalEarned
          )}
        />
      </span>
      <span>
        <Di
          title="Balance"
          className={styles.withDrawableValue}
          content={renderTooltip(
            totalUstBalance.toString(),
            Tooltip.My.TotalBalance
          )}
        />
      </span>
    </div>
  )
  return (
    <Grid>
      <Card
        title={"Staking Positions"}
        headerClass={styles.header}
        description={bound(description)}
      >
          { bound(<Table
                columns={[
                  {
                    key: "title",
                    title: "Token",
                    render: (value) => (
                      <div className={styles.d_flex}>
                        <img src={Loop_icon} alt="Loop" />
                        <span className={styles.pl10}>{value}</span>
                      </div>
                    ),
                  },
                  {
                    key: "staked",
                    title: "Staked",
                    render: (value) => (
                      <div>{value} {LOOP}</div>
                    ),
                    bold: true,
                  },
                  {
                      key: "loopBalance",
                      title: "Stakeable",
                      dataIndex: "loopBalance",
                      bold: true,
                      render: (value) => `${value} ${LOOP}`
                  },
                  {
                    key: "stakingRatio",
                    title: "Staking Ratio",
                    render: (value, {loopBalance, staked}) => decimal(multiple(div(staked, plus(staked, loopBalance)), "100"), 2),
                    bold: true,
                  },
                 {
                    key: "yourReward",
                    title: "Your Rewards",
                    dataIndex: "yourReward",
                     render: (value) => `${value.loop} ${LOOP}`,
                    bold: true,
                  },
                 {
                    key: "nextReward",
                    title: "Next Reward",
                    dataIndex: "nextReward",
                    bold: true,
                  },
                      {
                       key: "total_value",
                       title: "Total Value",
                       render: (value) => `${value} ${UST}`,
                       bold: true,
                     },
                  {
                      key: "apr",
                      title: "APR",
                      dataIndex: "apr",
                      bold: true,
                      render: (value) => `${value} %`
                  }
                ]}
                dataSource={data}
                placeholder={(
                    <p className={styles.description + " " + styles.holdingtext}>
                        {MESSAGE.MyPage.Empty.Staked}
                        <Link to="/stake">
                            <a onClick={() => {}} className={styles.tranLink}>
                                here
                            </a>
                        </Link>
                    </p>
                )}
              />,'loading')}

      </Card>
    </Grid>
  )
}

export default StakingInfo

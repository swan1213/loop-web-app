import Tooltip from "../../lang/Tooltip.json"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import { TooltipIcon } from "../../components/Tooltip"
import styles from "./DashboardHeader.module.scss"
import loop_price_icon from "../../images/icons/dashboard/loop_price.svg"
import fees_icon from "../../images/icons/dashboard/fees.svg"
import total_locked_icon from "../../images/icons/dashboard/total_locked.svg"
import transactions_icon from "../../images/icons/dashboard/transactions.svg"
import { bound } from "../../components/Boundary"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder"
import DashboardExchange from "../../components/V2Dashboard/DashboardExchange"
import FARMING_APR_ICON from "../../images/Pig.png"
import CLOCK_ICON from "../../images//Clock.png"
import BRICKS_ICON from '../../images/Bricks.png'
import FarmingAPR from './Header/FarmingAPR'
import StakingAPR from './Header/StakingAPR'
import Transactions from "./Header/Transactions"
import Volume from "./Header/Volume"
import TransactionsFee from "./Header/TransactonsFee"
import CirMarketCap from "./Header/CirMarketCap"
import { CirculatingSupply } from "./Header/CirMarketCap"
import FarmingRunway from "./Header/FarmingRunway"
import ProgressLoading from "../../components/Static/ProgressLoading"

// interface Props extends Partial<Dashboard> {
//   network: StatsNetwork
// }
export enum Type {
  "SWAP" = "Swap",
  "SELL" = "sell",
}

const DashboardHeader = () => {

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
          { bound(<DashboardExchange />, <Card title='swap' >
            <div className={styles.blankSwapContainer}>
            <ProgressLoading />
            </div>
            </Card>)}
      </div>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card} mainSectionClass={styles.card_main}>
          <Summary
            labelClassName={styles.label}
            icon={FARMING_APR_ICON}
            title={
              <TooltipIcon content={"Farming APR range"}>
                Farming APR
              </TooltipIcon>
            }
          >
            { bound(<FarmingAPR />,<LoadingPlaceholder size={"sm"} className={styles.loading} color={"lightGrey"} /> )}

          </Summary>
        </Card>
      </Grid>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card} mainSectionClass={styles.card_main}>
          <Summary
            labelClassName={styles.label}
            icon={FARMING_APR_ICON}
            title={
              <TooltipIcon content={"Farming APR range"}>
                Staking APR
              </TooltipIcon>
            }
          >
            { bound(<StakingAPR />,<LoadingPlaceholder size={"sm"} className={styles.loading} color={"lightGrey"} /> )}
          </Summary>
        </Card>
      </Grid>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card}>
          <Summary
            labelClassName={styles.label}
            icon={transactions_icon}
            title={
              <TooltipIcon content={Tooltip.Dashboard.Transactions}>
                Transactions
              </TooltipIcon>
            }
          >
           { bound(<Transactions />,<LoadingPlaceholder size={"sm"} className={styles.loading} color={"lightGrey"} /> )}
          </Summary>
        </Card>
      </Grid>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card}>
          <Summary
            labelClassName={styles.label}
            icon={total_locked_icon}
            title={
              <TooltipIcon content={'To Be Done'}>
                Protocol Owned Liquidity
              </TooltipIcon>
            }
          >
            <span   className={styles.aprRange}>TBD</span>
          </Summary>
        </Card>
      </Grid>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card}>
          <Summary
            labelClassName={styles.label}
            icon={fees_icon}
            title={
              <TooltipIcon content={Tooltip.Dashboard.TotalValueLocked}>
                Volume
              </TooltipIcon>
            }
          >
           { bound(<Volume />, <LoadingPlaceholder size={"sm"} className={styles.loading} color={"lightGrey"} /> )}
          </Summary>
        </Card>
      </Grid>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card}>
          <Summary
            labelClassName={styles.label}
            icon={fees_icon}
            title={
              <TooltipIcon content={Tooltip.Dashboard.Fee}>
                Trading Fees
              </TooltipIcon>
            }
          >
            { bound(<TransactionsFee />, <LoadingPlaceholder size={"sm"} className={styles.loading} color={"lightGrey"} /> )}
          </Summary>
        </Card>
      </Grid>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card} mainSectionClass={styles.card_main}>
          <Summary
            labelClassName={styles.label}
            icon={CLOCK_ICON}
            title={
              <TooltipIcon content={"Current Month Loop Cir Market Cap"}>
                Cir. Market Cap
              </TooltipIcon>
            }
          >
          { bound(<CirMarketCap />,<LoadingPlaceholder size={"sm"} className={styles.loading} color={"lightGrey"} /> )}
          </Summary>
        </Card>
      </Grid>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card} mainSectionClass={styles.card_main}>
          <Summary
            labelClassName={styles.label}
            icon={loop_price_icon}
            title={
              <TooltipIcon content={"Current Month Loop Circulating Supply"}>
                Circulating Supply
              </TooltipIcon>
            }
          >
            {bound(<CirculatingSupply />,   <LoadingPlaceholder size={"sm"} className={styles.loading} color={"lightGrey"} /> )}
          </Summary>
        </Card>
      </Grid>

      <Grid className={styles.CzcardGrid}>
        <Card className={styles.card} mainSectionClass={styles.card_main}>
          <Summary
            labelClassName={styles.label}
            icon={BRICKS_ICON}
            title={
              <TooltipIcon content={"Days Passed Since Farming"}>
                Farmig Runway
              </TooltipIcon>
            }
          >
            { bound(<FarmingRunway />,<LoadingPlaceholder size={"sm"} className={styles.loading} color={"lightGrey"} /> )}
          </Summary>
        </Card>
      </Grid>


      {/*<Grid>
        <Card className={styles.card}>
          <Summary
            labelClassName={styles.label}
            icon={community_pool_icon}
            title={
              <TooltipIcon content={Tooltip.Dashboard.CommunityPoolBalance}>
                Community Pool Balance
              </TooltipIcon>
            }
          >
            <Count symbol={LOOP} integer className={styles.count} priceClass={styles.price}>
              {communityBalance}
            </Count>
          </Summary>
        </Card>
      </Grid>*/}
    </>
  )
}

export default DashboardHeader

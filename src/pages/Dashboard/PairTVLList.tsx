import { UST } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import Table from "../../components/Table"
import { TooltipIcon } from "../../components/Tooltip"
import styles from "./TopTrading.module.scss"
import { commas, decimal, formatAssetAmount } from "../../libs/parse"
import { getICon2} from "../../routes"
import { bound } from "../../components/Boundary"
import {ApyTooltipIcon} from "../../components/ApyToolTip"
import FarmApyTooltipContent from "../../components/FarmApyTooltipContent"
import {useFarmsList} from "../Farm/useFarmBetaList"
import {gt, lt} from "../../libs/math";
import { useState } from "react"

const PairTVLList = () => {
    const dataSource = useFarmsList().filter((li) => gt(li.total_fee, 0) && gt(li.total_locked, 0))
        .sort((a, b) => (lt(a.total_fee, b.total_fee) ? 1 : -1))

        const [isExpand,setIsExpand]=useState(false);
    

  return (
  <>
  <Table
      columns={[
         /* {
              key: "rank",
              title: "No.",
              render: (_value, _record, index) => index + 1,
          },*/
        {
          key: "symbol",
          title: "Ticker",
          render: (_value, _record, index) => {
            return (
              <div className={styles.icontable}>
                <div className={styles.icontableHub}>
                  <img
                    style={{ width: "30px", borderRadius: "25px" }}
                    src={getICon2(_value.split("-")[0].trim().toUpperCase())}
                    alt=" "
                  />
                  <img
                    style={{ width: "30px", borderRadius: "25px" }}
                    src={getICon2(_value.split("-")[1].trim().toUpperCase())}
                    alt=" "
                  />
                </div>
                <p style={{ display: "block" }}>{_value}</p>
              </div>
            )
          },
          bold: true,
        },
        {
          key: "total_locked",
          title: (
            <TooltipIcon content={Tooltip.TopTrading.Liquidity}>
              Total Locked
            </TooltipIcon>
          ),
          render: (value) =>
            bound(`$${formatAssetAmount(value, UST)}`, "Loading..."),
        },
        /*{
          key: "volume",
          title: (
            <TooltipIcon content={Tooltip.TopTrading.Volume7day}>
              7 day Volume
            </TooltipIcon>
          ),
          render: (value) => `$${formatAssetAmount(value, UST)}`,
        },*/
        {
          key: "total_fee",
          title: (
            <TooltipIcon content={Tooltip.TopTrading.Fee7day}>
              7 day trading fee
            </TooltipIcon>
          ),
          render: (value) =>
            bound(`$${commas(decimal(value, 3))}`, "fetching..."),
        },
        /*{
          key: "7dayFee",
          title: (
            <TooltipIcon content={Tooltip.TopTrading.Fee7day}>
              7 day trading fee
            </TooltipIcon>
          ),
          render: (value, { volume }) => {
            const val = multiple(div(volume, 100), 0.3)
            return bound(`$${formatAssetAmount(gt(val, "5000000000") ? div(val, "2") : val, UST)}`, "$0")
          },
        },*/
        /*{
          key: "apr2",
          title: <TooltipIcon content={"APR"}>APR</TooltipIcon>,
          render: (value) =>
            bound(
              <LinkButton
                className={styles.simpleLink}
                to={getPath(MenuKey.FARMBETA)}
              >
                {value}{" "}
                <img
                  height={"10px"}
                  style={{ marginLeft: 3 }}
                  src={topRightIcon}
                  alt={"link"}
                />
              </LinkButton>,
              "COMING SOON..."
            ),
        },*/
          {
              key: "all_apy",
              title: "Combined APY",
              render: (value, {all_apr, tx_fee_apy,symbol}) => bound(<ApyTooltipIcon content={<><FarmApyTooltipContent symbol={symbol} apy={value} tx_fee_apy={tx_fee_apy}  apr={all_apr}/></>}><span className={styles.blue}>{bound(value, "fetching...")}</span> </ApyTooltipIcon>, 'fetching...')
          },
      ]}
      dataSource={isExpand ? dataSource : dataSource.slice(0,10)}

    />
    {!isExpand && 
      <div className={styles.expandBtn} onClick={()=>setIsExpand(true)}>Expand All</div>
      }
    </>
  )
}

export default PairTVLList

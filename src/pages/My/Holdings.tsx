import { Helmet } from "react-helmet"
import { Grid } from "@material-ui/core"

import Tooltip from "../../lang/Tooltip.json"
import {UST, UUSD} from "../../constants"
import {
    commas, decimal, decimalnPlaces,
    formatAsset,
    formatAssetAmount,
    lookupSymbol,
} from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"
import Card from "../../components/Card"
import Table from "../../components/Table"
import { Di } from "../../components/Dl"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { Type } from "../Exchange"
import styles from "./Holdings.module.scss"
import Price from "../../components/Price"
import {bound} from "../../components/Boundary"
import MESSAGE from "../../lang/MESSAGE.json"
import {openTransak} from "../BuyUst";
import useMyHoldings from "./useMyHoldings";

const Holdings = () => {
    const {totalValue, dataSource } = useMyHoldings()

  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>
      <Price
        price={decimal(formatAssetAmount(value, UST),2)}
        symbol={lookupSymbol(UUSD)}
      />
    </TooltipIcon>
  )

  const dataExists = !!dataSource.length

  const description = dataExists && (
    <Di
      title="Total Holding Value"
      className={styles.withDrawableValue}
      content={renderTooltip(totalValue, Tooltip.My.TotalHoldingValue)}
    />
  )

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | My Page</title>
      </Helmet>
      <Card
        title={"Holdings"}
        headerClass={styles.header}
        description={bound(description)}
      >
         <Table
            columns={[
              {
                key: "symbol",
                title: "Ticker",
                render: (symbol, { status }) => (
                  <>
                    {status === "DELISTED" && <Delisted />}
                    {lookupSymbol(symbol)}
                  </>
                ),
                bold: true,
              },
              { key: "name", title: "Name" },
              {
                key: "price",
                render: (value) => `${decimalnPlaces(value, "000")} ${UST}`,
              },
              /*{
              key: "change",
              title: "",
              render: (change: string) => <Change>{change}</Change>,
              narrow: ["left"],
            },*/
              {
                key: "balance",
                title: (
                  <TooltipIcon content={Tooltip.My.Balance}>
                    Balance
                  </TooltipIcon>
                ),
                render: (value) => formatAssetAmount(value, UST),
              },
              {
                key: "value",
                title: (
                  <TooltipIcon content={Tooltip.My.Value}>Value</TooltipIcon>
                ),
                render: (value) => commas(formatAsset(value, UST)),
              },
              /*{
              key: "ratio",
              dataIndex: "value",
              title: (
                <TooltipIcon content={Tooltip.My.PortfolioRatio}>
                  Port. Ratio
                </TooltipIcon>
              ),
              render: (value) => percent(div(value, totalValue)),
              align: "right",
            },*/
              {
                key: "actions",
                dataIndex: "token",
                render: (token) => {
                  const to = {
                    pathname: getPath(MenuKey.SWAP),
                    state: { token },
                  }

                  const list = [
                    { to: { ...to, hash: Type.SWAP }, children: Type.SWAP },
                  ]

                  return <DashboardActions list={list} />
                },
                align: "right",
                fixed: "right",
              },
            ]}
            dataSource={dataSource}
            placeholder={!dataExists && (<p className={styles.description + " " + styles.holdingtext}>
                {MESSAGE.MyPage.Empty.Holdings}
                <a
                    onClick={() => {
                        openTransak()
                    }}
                    className={styles.tranLink}
                >
                    credit card here
                </a>
            </p>)}
          />
      </Card>
    </Grid>
  )
}

export default Holdings

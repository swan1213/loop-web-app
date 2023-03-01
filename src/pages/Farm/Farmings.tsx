import MESSAGE from "../../lang/MESSAGE.json"
import { getPath, MenuKey } from "../../routes"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { Type } from "../Exchange"
import NoAssets from "./NoAssets"

interface Data extends ListedItem {
  balance: string
  price: string
  value: string
  change?: string
}

interface Props {
  loading: boolean
  totalValue: string
  dataSource: Data[]
}

const Holdings = ({ loading, /*totalValue,*/ dataSource }: Props) => {
  const dataExists = !!dataSource.length

  /*const description = dataExists && (
    <Di
      title="Total Holding Value"
      content={renderTooltip(totalValue, Tooltip.My.TotalHoldingValue)}
    />
  )*/

  return (
    <Card
      title={"Farm"}
      /*description={description}*/
      loading={loading}
    >
      {dataExists ? (
        <Table
          columns={[
            {
              key: "symbol",
              title: "Ticker",
              render: (symbol, { status }) => (
                <>
                  {status === "DELISTED" && <Delisted />}
                  {symbol}
                </>
              ),
              bold: true,
            },
            { key: "pending_reward", title: "Pending Reward" },
            { key: "staked", title: "Staked" },
            { key: "apr", title: "APR" },
            {
              key: "change",
              title: "Liquidity",
            },
            {
              key: "actions",
              dataIndex: "token",
              render: (token) => {
                const to = {
                  pathname: getPath(MenuKey.SWAP),
                  state: { token },
                }

                const list = [
                  { to: { ...to, hash: Type.SWAP }, children: 'Buy' },
                  { to: { ...to, hash: Type.SELL }, children: Type.SELL },
                  {
                    to: { ...to, pathname: getPath(MenuKey.SEND) },
                    children: MenuKey.SEND,
                  },
                ]

                return <DashboardActions list={list} />
              },
              align: "right",
              fixed: "right",
            },
          ]}
          dataSource={dataSource}
        />
      ) : (
        !loading && (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Holdings}
            link={MenuKey.SWAP}
          />
        )
      )}
    </Card>
  )
}

export default Holdings

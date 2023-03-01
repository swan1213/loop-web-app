import {ReactNode} from "react"

import { LP } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { formatAsset } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"

import { Type } from "../PoolDynamic"
import NoAssets from "../My/NoAssets"

interface Data extends ListedItem {
  balance: string
  withdrawable: { value: string; text: string }
  share: string | Element | ReactNode
}

interface Props {
  loading: boolean
  totalWithdrawableValue: string
  dataSource: Data[]
}

const MyPoolTable = ({ dataSource }: Props) => {
  const dataExists = !!dataSource.length
  /*const description = dataExists && (
    <Di
      title="Total Withdrawable Value"
      content={
        <TooltipIcon content={Tooltip.My.TotalWithdrawableValue}>
          <p><span className={styles.value}>{formatAssetAmount(totalWithdrawableValue, formatAssetToken(UUSD))}</span> <span>{formatAssetToken(UUSD)}</span></p>
        </TooltipIcon>
      }
    />
  )*/

  return (
    <>
      {dataExists ? (
        <Table
          columns={[
            {
              key: "symbol",
              title: "Pool Name",
              render: (symbol, { status }) => (
                <>
                  {status === "DELISTED" && <Delisted />}
                  {symbol}
                </>
              ),
              bold: true,
            },
            {
              key: "balance",
              title: (
                <TooltipIcon content={Tooltip.My.LP}>LP Balance</TooltipIcon>
              ),
              render: (value) => formatAsset(value, LP),
            },
            {
              key: "share",
              title: (
                <TooltipIcon content={Tooltip.My.PoolShare}>
                  Pool share
                </TooltipIcon>
              )
            },
            {
              key: "actions",
              dataIndex: "pair",
              render: (pair, {lpToken}) => {
                const to = {
                  pathname: getPath(MenuKey.POOL),
                  state: { pair, lpToken },
                }

                const farmRoute = `${getPath(MenuKey.FARMBETA)}`

                const list = [
                  {
                    to: { ...to, hash: Type.PROVIDE },
                    children: Type.PROVIDE,
                  },
                  {
                    to: { ...to, hash: Type.WITHDRAW },
                    children: Type.WITHDRAW,
                  },
                  {
                    to: farmRoute,
                    children: MenuKey.FARMBETA,
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
          <NoAssets
            description={MESSAGE.MyPage.Empty.Pool}
            link={MenuKey.POOL}
          />

      )}
    </>
  )
}

export default MyPoolTable

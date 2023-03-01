import styles from "./ClaimAirdrop.module.scss"
import { useFetchTokens } from "../../hooks"
import { formatAsset, lookupSymbol } from "../../libs/parse"
import { LP } from "../../constants"
import {
  useGetTokenInfoQuery,
} from "../../data/contract/info"
import { TooltipIcon } from "../../components/Tooltip"
import Tooltip from "../../lang/Tooltip.json"
import Table from "../../components/Table"
import Delisted from "../../components/Delisted"
import { getPath, MenuKey } from "../../routes"
import { Type } from "../PoolDynamic"
import DashboardActions from "../../components/DashboardActions"
import NoAssets from "../My/NoAssets"
import MESSAGE from "../../lang/MESSAGE.json"
import Card from "../../components/Card"
import LinkButton from "../../components/LinkButton"

const FarmingList = () => {
  // const getTokenInfoFn = useRecoilValue(getTokenInfoQuery)
  const getTokenInfoFn = useGetTokenInfoQuery()
  // const farmReward = useRecoilValue(farmRewardQuery)
  const { contractPairList } = useFetchTokens()

  const list = contractPairList.map(
    (contractPair: {
      asset_infos: {
        token?: { contract_addr: string }
        native_token?: { denom: string }
      }[]
      contract_addr: string
      liquidity_token: string
    }) => {
      const pairs = contractPair.asset_infos.map((info) => {
        if (info?.native_token !== undefined) {
          return {
            token: lookupSymbol(info.native_token.denom) ?? "",
            symbol: lookupSymbol(info.native_token.denom) ?? "",
          }
        } else {
          const tokenInfo = getTokenInfoFn?.(info.token?.contract_addr ?? "")
          const symbol = tokenInfo?.symbol ?? ""

          return { token: info.token?.contract_addr ?? "", symbol }
        }
      })
      return {
        pairs,
        token: contractPair.liquidity_token,
        name: pairs.map((pair) => pair.symbol).join(" - "),
        symbol: pairs.map((pair) => pair.symbol).join(" - "),
        lpToken: contractPair.liquidity_token,
        contract_addr: contractPair.contract_addr,
        pair: contractPair.contract_addr,
        status: "LISTED",
      }
    }
  )

  const dataSource =
    list &&
    list.map((item) => {
      return {
        ...item,
        balance: "0",
        withdrawable: "",
        share: "",
      }
    })

  const link = {
    to: "/admin",
    children: "Go Back",
    outline: false,
  }

  return (
    <Card
      title={"Farms"}
      headerClass={styles.header}
      action={<LinkButton {...link} />}
    >
      {dataSource.length ? (
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
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "token",
              render: (token) => {
                const to = {
                  pathname: getPath(MenuKey.POOL),
                  state: { token },
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
        !dataSource.length && (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Pool}
            link={MenuKey.POOL}
          />
        )
      )}
    </Card>
  )
}

export default FarmingList

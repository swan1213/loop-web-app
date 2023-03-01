import { useState } from "react"
import { useLocation } from "react-router-dom"
import { Helmet } from "react-helmet"
import { TxResult } from "@terra-money/wallet-provider"

import Tooltip from "../lang/Tooltip.json"
import useHash from "../libs/useHash"
import Page from "../components/Page"
import PoolDynamicForm from "../forms/PoolDynamicForm"
import { useFetchTokens } from "../hooks"
import { div } from "../libs/math"
import Grid from "../components/Grid"
import { PostError } from "../forms/CustomMsgFormContainer"
import Result from "../forms/Result"
import Container from "../components/Container"
import usePoolReceipt from "../forms/receipts/usePoolReceipt"
import styles from "./Exchange.module.scss"
import TopTrading from "./Dashboard/TopTrading"

export enum Type {
  "PROVIDE" = "provide",
  "WITHDRAW" = "withdraw"
}

const PoolDynamic = () => {
  const { hash: type } = useHash<Type>(Type.PROVIDE)
  const tab = {
    tabs: [Type.PROVIDE, Type.WITHDRAW],
    tooltips: [Tooltip.Pool.Provide, Tooltip.Pool.Withdraw],
    current: type,
  }
  const { state } = useLocation<{ pair?: string; lpToken?: string }>()
  const pair = state?.pair
  const lpToken = state?.lpToken
  const { getTokensFromPair } = useFetchTokens()
  const tokens = pair && getTokensFromPair(pair)


  // const twentyHourTradeList = useRecoilValue(twentyHourNWeekUstTradeQuery)
  // const twentyHourTradeList = useTwentyHourNWeekUstTradeQuery().contents
  // const list = useFarmingList()

  // const { simulated: values } = useAPR()

  /*const getAsset: any | SimulatedAsset = (lpToken: string): SimulatedAsset => {
    const asset =
      values !== undefined &&
      values.find((val: { asset: { token: { contract_addr: string } } }) => {
        return val.asset.token.contract_addr === lpToken
      })

    return asset !== undefined
      ? asset
      : {
          asset: {
            token: {
              contract_addr: "",
            },
          },
          apr: "0",
          apy: "0",
          liqval: "0",
        }
  }*/

  /*const dataSource = list.map((item: DATASOURCE) => {
    const { lpToken, symbol, tokens } = item
    const { liqval } = getAsset(lpToken)
    let vol24hr = "0"
    let vol7d = "0"
    if (symbol.includes("UST")) {
      const token1 = tokens?.find((token) => token.native_token === undefined)
        ?.token?.contract_addr
      vol7d = token1 ? twentyHourTradeList?.[token1]?.aWeek ?? "0" : "0"
      vol24hr = token1 ? twentyHourTradeList?.[token1]?.twentyhours ?? "0" : "0"
    } else {
      const pairToken1 =
        tokens &&
        (tokens[0].native_token
          ? tokens[0].native_token.denom
          : tokens[0]?.token?.contract_addr)
      const pairToken2 =
        tokens &&
        (tokens[1].native_token
          ? tokens[1].native_token.denom
          : tokens[1]?.token?.contract_addr)

      const ifToken1WithUst = pairToken1
        ? twentyHourTradeList?.[pairToken1]
        : undefined
      const ifToken2WithUst = pairToken2
        ? twentyHourTradeList?.[pairToken2]
        : undefined
      if (ifToken1WithUst || ifToken2WithUst) {
        if (ifToken1WithUst && ifToken2WithUst) {
          vol24hr =
            ifToken1WithUst.twentyhours > ifToken2WithUst.twentyhours
              ? ifToken1WithUst.twentyhours
              : ifToken2WithUst.twentyhours
          vol7d =
            ifToken1WithUst.aWeek > ifToken2WithUst.aWeek
              ? ifToken1WithUst.aWeek
              : ifToken2WithUst.aWeek
        } else if (ifToken1WithUst) {
          vol24hr = ifToken1WithUst.twentyhours ?? "0"
          vol7d = ifToken1WithUst.aWeek ?? "0"
        } else if (ifToken2WithUst) {
          vol24hr = ifToken2WithUst.twentyhours ?? "0"
          vol7d = ifToken2WithUst.aWeek ?? "0"
        }
      }
    }
    return {
      ...item,
      symbol: symbol ?? "",
      volume24: vol24hr,
      fee24: multiple(div(vol24hr, 100), 0.3),
      volume7d: vol7d,
      fee1year: "0",
      liquidity: liqval ? div(liqval, 100000000) : "0",
    }
  })*/

  const [response, setResponse] = useState<TxResult | undefined>()
  const [error, setError] = useState<PostError>()

  const responseFun = (
    res: TxResult | undefined,
    errorRes?: PostError | undefined
  ) => {
    if (res) {
      setResponse(res)
    }
    if (errorRes) {
      setError(errorRes)
    }
  }
  const reset = () => {
    setResponse(undefined)
    setError(undefined)
  }
  const parseTx = usePoolReceipt(type)

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Pool</title>
      </Helmet>
      <Page>
        {response || error ? (
          <Container sm>
            <Result
              response={response}
              error={error}
              parseTx={parseTx}
              onFailure={reset}
              gov={false}
            />
          </Container>
        ) : (
          <div className={styles.poolBox}>
            {type && (
              <PoolDynamicForm
                responseFun={responseFun}
                lpTokenProp={lpToken}
                pairProp={pair}
                token1Prop={tokens ? tokens[0]?.contract_addr : ""}
                token2Prop={tokens ? tokens[1]?.contract_addr : ""}
                type={type}
                tab={tab}
                key={type}
              />
            )}
            {false && (
                <></>
              /*<Card title={"LOOP Pools"}>
                {dataSource && (
                  <Table
                    columns={[
                      { key: "symbol", title: "Name" },
                      {
                        key: "liquidity",
                        title: "Liquidity",
                      },
                      {
                        key: "volume24",
                        title: "Volume(24hrs)",
                      },
                      {
                        key: "volume7d",
                        title: "Volume(7d)",
                      },
                      {
                        key: "fee24",
                        title: "Fees(24hrs)",
                      },
                      {
                        key: "fee1year",
                        title: "1y Fees / Liquidity",
                      },
                    ]}
                    /!*dataSource={dataSource.filter((li) => gt(li.liquidity, 0))}*!/
                    dataSource={dataSource}
                  />
                )}
              </Card>*/
            )}
            <TopTrading />
          </div>
        )}
      </Page>
    </Grid>
  )
}

export default PoolDynamic



import { useEffect, useState } from "react"
import classNames from "classnames/bind"
import { useQuery } from "@apollo/client"
import {
  startOfMinute,
  subDays,
  subHours,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns"

import {adjustAmount, commas, decimal, lookupSymbol} from "../libs/parse"
import Change from "../components/Change"
import {
  ASSETPRICE,
  ASSETPRICEAT,
  ASSETPRICEHISTORY,
} from "../statistics/gqldocs"
import useStatsClient from "../statistics/useStatsClient"
import { calcChange } from "../statistics/useYesterday"
import ChartContainer from "./ChartContainer"
import styles from "./PriceChart.module.scss"
import { EXCHANGE_TOKEN } from "../pages/Exchange"
import { useRecoilValue } from "recoil"
import { menuCollapsed } from "../data/app"
import { useTokenMethods } from "../data/contract/info";
import TradingChart from "../components/TradingChart"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"

const cx = classNames.bind(styles)

interface Item {
  timestamp: number
  price: number
}

interface Data {
  price: string
  priceAt: string
  history: Item[]
}

interface Response {
  asset: { prices: Data }
}
interface Props {
  token1: EXCHANGE_TOKEN
  token2?: EXCHANGE_TOKEN
}
interface History {
  timestamp: number
  price: string
}

const PriceChart = ({ token1, token2 }: Props) => {
  const now = startOfMinute(new Date())
  const [mode, setMode] = useState(0);
  const ranges = [
    {
      label: "1h",
      interval: 1, // 1 minute
      from: subHours(now, 1).getTime(),
      fmt: "dd LLL, yy",
    },
    {
      label: "12h",
      interval: 60 / 12, // 5 minutes
      from: subHours(now, 12).getTime(),
      fmt: "dd LLL, yy",
    },
    {
      label: "1d",
      interval: 60 / 4, // 15 minutes
      from: subDays(now, 1).getTime(),
      fmt: "EEE, dd LLL, HH:mm aa",
    },
    {
      label: "1w",
      interval: 60, // 1 hour
      from: subWeeks(now, 1).getTime(),
      fmt: "EEE, dd LLL, HH:mm aa",
    },
    {
      label: "1M",
      interval: 60 * 24, // 1 day
      from: subMonths(now, 1).getTime(),
      fmt: "dd LLL, yy",
    },
    {
      label: "3M",
      interval: 60 * 24 * 3, // 3 day
      from: subMonths(now, 3).getTime(),
      fmt: "dd LLL, yy",
    },
    {
      label: "1y",
      interval: 60 * 24 * 7, // 1 week
      from: subYears(now, 1).getTime(),
      fmt: "dd LLL, yy",
    },
  ]

  /* request */
  const [range, setRange] = useState(ranges[0])
  // const [data, setDate] = useState<Data>()
  // const params = { token: token1.token, ...range, to: now.getTime(), yesterday }
  const historyParams = {
    token: token1.token,
    ...range,
    to: now.getTime(),
    second_token: token2?.token,
  }
  const priceParams = { token: token1.token, second_token: token2?.token }
  const priceAtParams = {
    token: token1.token,
    second_token: token2?.token ?? "",
    timestamp: subDays(now, 1).getTime(),
  }
  const [historyData, setHistoryDate] = useState<History[]>([])
  const [priceData, serPriceData] = useState<string>()
  const [priceAtData, serPriceAtData] = useState<string>()
  const client = useStatsClient()
  const menuCollapsedState = useRecoilValue(menuCollapsed)
  // get history
  const { refetch: refetchHistory } = useQuery<{ getHistory: History[] }>(
      ASSETPRICEHISTORY,
      {
        client,
        variables: historyParams,
        skip: !token1.token || !token2?.token,
        onCompleted: (data) => {
          data && setHistoryDate(data.getHistory)
        },
      }
  )

  // get price
  const { refetch: refetchPrice } = useQuery<{ getPrice: string }>(ASSETPRICE, {
    client,
    variables: priceParams,
    skip: !token1.token || !token2?.token,
    onCompleted: (data) => {
      data && serPriceData(data.getPrice)
    },
  })

  // get priceAt
  const { refetch: refetchPriceAt } = useQuery<{ getPriceAt: string }>(
      ASSETPRICEAT,
      {
        client,
        variables: priceAtParams,
        skip: !token1.token || !token2?.token,
        onCompleted: (data) => {
          data && serPriceAtData(data.getPriceAt)
        },
      }
  )

  useEffect(() => {
    !historyData && refetchHistory()
    !priceData && refetchPrice()
    !priceAtData && refetchPriceAt()
  }, [token1, token2, menuCollapsedState])

  useEffect(() => {
    setInterval(() => {
      refetchHistory()
      refetchPrice()
      refetchPriceAt()
    }, 5000)
  }, [])

  /* render */
  const change = calcChange({
    today: priceData ?? "0",
    yesterday: priceAtData ?? "0",
  })

  const { check8decOper, check8decTokens } = useTokenMethods()
  const bothAreWh = check8decTokens(
      token1.token,
      token2?.token
  )

  return (
    <div className={styles.component}>
      {
        (<>
          <header className={styles.header}>
            <section className={styles.token}>
              <Change
                  className={styles.price}
                  price={`${commas(decimal(adjustAmount(bothAreWh,check8decOper(token2?.token), priceData) ?? "0", 4))} ${lookupSymbol(token2?.symbol) ?? ""}`}
              >
                {change}
              </Change>
            </section>
            <section className={styles.ranges}>
              {ranges.map((r) => (
                  <button
                      type="button"
                      className={cx(styles.button, { active: r.label === range.label })}
                      onClick={() => setRange(r)}
                      key={r.label}
                  >
                    {r.label}
                  </button>
              ))}
            </section>
            <section>
              <Box
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: "20px",
                }}
              >
                {mode === 0 ? (
                  <Button
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      color: "rgb(20, 200, 20)",
                      fontSize: "12px",
                      borderRadius: "20px",
                    }}
                    onClick={() => setMode(0)}
                  >
                    SIMPLE
                  </Button>
                ) : (
                  <Button
                    style={{
                      color: "rgb(200, 200, 200)",
                      fontSize: "12px",
                      borderRadius: "20px",
                    }}
                    onClick={() => setMode(0)}
                  >
                    SIMPLE
                  </Button>
                )}
                {mode === 1 ? (
                  <Button
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      color: "rgb(20, 200, 20)",
                      fontSize: "12px",
                      borderRadius: "20px",
                    }}
                    onClick={() => setMode(1)}
                  >
                    ADVANCED
                  </Button>
                ) : (
                  <Button
                    style={{
                      color: "rgb(200, 200, 200)",
                      fontSize: "12px",
                      borderRadius: "20px",
                    }}
                    onClick={() => setMode(1)}
                  >
                    ADVANCED
                  </Button>
                )}
              </Box>
            </section>
          </header>
          <div>
            {mode === 0 ? <ChartContainer
              change={change}
              datasets={historyData?.map(({ timestamp: t, price: y }) => {
                const price = adjustAmount(bothAreWh, check8decOper(token2?.token), y)
                return { y: price, t }
              })}
              fmt={{ t: range.fmt }}
            /> :
              <TradingChart period={range.label} token1={token1.token} token2={token2.token} />}
          </div>
        </>)
      }
    </div>
  )
}

export default PriceChart

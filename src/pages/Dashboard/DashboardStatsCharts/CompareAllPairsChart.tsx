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

import {
  adjustAmount,
} from "../../../libs/parse"
import {
  ASSETPRICE,
  ASSETPRICEAT,
  ASSETPRICEHISTORY,
} from "../../../statistics/gqldocs"
import useStatsClient from "../../../statistics/useStatsClient"
import { calcChange } from "../../../statistics/useYesterday"
import styles from "./CompareAllPairsChart.module.scss"
import { EXCHANGE_TOKEN } from "../../../pages/Exchange"
import { useRecoilValue } from "recoil"
import { menuCollapsed } from "../../../data/app"
import { useTokenMethods } from "../../../data/contract/info"
import MultiLineChartContainer from "../../../containers/MultiLineChartContainer"
import ComputeAllPairsChartHeader from "../../../components/ComputeAllPairsChartHeader"
import { LOOP, LOOPR, UST } from "../../../constants"

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

const CompateAllPairsChart = () => {
  const [tokens, setTokens] = useState<any>([])
  const [secondtokens, setSecondTokens] = useState<any>([])

  const token1 = {
    token: tokens[0]?.token,
    symbol: tokens[0]?.tokenSymbol,
  }
  const token2 = {
    token: tokens[1]?.token,
    symbol: tokens[1]?.tokenSymbol,
  }

  const token3 = {
    token: secondtokens[0]?.token,
    symbol: secondtokens[0]?.tokenSymbol,
  }
  const token4 = {
    token: secondtokens[1]?.token,
    symbol: secondtokens[1]?.tokenSymbol,
  }

  const now = startOfMinute(new Date())
  // const yesterday = subDays(now, 1).getTime()

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
  const [range, setRange] = useState(ranges[3])
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
  const [historyData2, setHistoryDate2] = useState<History[]>([])
  const [priceData, serPriceData] = useState<string>()
  const [priceData2, serPriceData2] = useState<string>()
  const [priceAtData, serPriceAtData] = useState<string>()
  const [priceAtData2, serPriceAtData2] = useState<string>()
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

  useEffect(() => {
    setInterval(() => {
      refetchHistory2()
      refetchPrice2()
      refetchPriceAt2()
    }, 5000)
  }, [])

  /* render */
  const change = calcChange({
    today: priceData ?? "0",
    yesterday: priceAtData ?? "0",
  })

  const { check8decOper, check8decTokens } = useTokenMethods()
  const bothAreWh = check8decTokens(token1.token, token2?.token)

  //for secondPair

  const change2 = calcChange({
    today: priceData2 ?? "0",
    yesterday: priceAtData2 ?? "0",
  })

  const historyParams2 = {
    token: token3.token,
    ...range,
    to: now.getTime(),
    second_token: token4?.token,
  }
  const priceParams2 = { token: token3.token, second_token: token4?.token }
  const priceAtParams2 = {
    token: token3.token,
    second_token: token4?.token ?? "",
    timestamp: subDays(now, 1).getTime(),
  }

  const { refetch: refetchHistory2 } = useQuery<{ getHistory: History[] }>(
    ASSETPRICEHISTORY,
    {
      client,
      variables: historyParams2,
      skip: !token3.token || !token2?.token,
      onCompleted: (data) => {
        data && setHistoryDate2(data.getHistory)
      },
    }
  )

  // get price
  const { refetch: refetchPrice2 } = useQuery<{ getPrice: string }>(
    ASSETPRICE,
    {
      client,
      variables: priceParams2,
      skip: !token3.token || !token4?.token,
      onCompleted: (data) => {
        data && serPriceData2(data.getPrice)
      },
    }
  )

  const { refetch: refetchPriceAt2 } = useQuery<{ getPriceAt2: string }>(
    ASSETPRICEAT,
    {
      client,
      variables: priceAtParams2,
      skip: !token3.token || !token4?.token,
      onCompleted: (data) => {
        data && serPriceAtData2(data.getPriceAt2)
      },
    }
  )

  useEffect(() => {
    !historyData2 && refetchHistory2()
    !priceData2 && refetchPrice2()
    !priceAtData2 && refetchPriceAt2()
  }, [token3, token4, menuCollapsedState])

  const bothAreWh2 = check8decTokens(token3.token, token4?.token)

  const secondPairData = historyData2?.map(({ timestamp: t, price: y }) => {
    const price = adjustAmount(bothAreWh2, check8decOper(token4?.token), y)
    return { y: price, t }
  })
  const firstPairData = historyData?.map(({ timestamp: t, price: y }) => {
    const price = adjustAmount(bothAreWh, check8decOper(token2?.token), y)
    return { y: price, t }
  })

  const dataSource1 = [...firstPairData]
  const dataSource2 = [...secondPairData]

  return (
    <div className={styles.component}>
      <header className={styles.header}>
        <span className={styles.displayFlex}>
                  <span className={styles.priceDropdown}>
          Price
          {/* <img src={DOWN_ARROW} alt='down_arrow'/>  */}
        </span>
        <span
          className={styles.priceDropdown}
          style={{ borderColor: "#01CDFD" }}
        >
          <ComputeAllPairsChartHeader
            tokensDetail={tokens}
            setTokens={setTokens}
          />
        </span>

        <span
          className={styles.priceDropdown}
          style={{ borderColor: " #32FE9A" }}
        >
          <ComputeAllPairsChartHeader
            tokensDetail={secondtokens}
            setTokens={setSecondTokens}
          />
        </span>
        </span>
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
      </header>

      <div className={styles.chart}>
        <MultiLineChartContainer
          change={change2}
          datasets1={dataSource1}
          datasets2={dataSource2}
          fmt={{ t: range.fmt }}
          multiAxes={true}
          dataSet1Label={tokens[0]?.tokenSymbol+"_"+tokens[1]?.tokenSymbol}
          dataSet2Label={secondtokens[0]?.tokenSymbol+"_"+secondtokens[1]?.tokenSymbol}

        />
      </div>
    </div>
  )
}

export default CompateAllPairsChart

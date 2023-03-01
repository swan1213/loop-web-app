import React, { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { commas, decimal } from "../../libs/parse"
import { parseDataSource } from "../../pages/My/dataSourceParser"
import useMy from "../../pages/My/useMy"
import styles from "./PortFolioChart.module.scss"
import { useFarmsList } from "../../pages/Farm/useFarmBetaList"
import { div, gt, multiple } from "../../libs/math"

const useFarmUserStaked = () => {
  const dataList = useFarmsList(true)

  return dataList && dataList.length > 0
    ? dataList
        ?.filter((farm) => gt(farm.staked ?? "0", "0"))
        ?.map((farm) => {
          return { symbol: farm?.symbol ?? "", staked: farm?.staked ?? "" }
        })
    : []
}

const PortFolioChart = () => {
  const [tab, setTab] = useState(0)
  const { holdings, pool, staking } = useMy()
  const list = useFarmUserStaked()
  const [percentageDataList, setPercentageDataList] = useState<any>([])
  // console.log("dataList", list)

  const dataSource =
    tab === 1
      ? parseDataSource(list, "Farm", "staked", "symbol") //{ symbolsArray:list?.map(({symbol})=>symbol), data1: list?.map(({staked})=>staked)}
      : tab === 2
      ? parseDataSource(pool.dataSource, "pool", "withdrawableValue", "symbol")
      : tab === 3
      ? parseDataSource(staking.dataSource, "staking", "total_value", "title")
      : parseDataSource(holdings.dataSource, "holdings", "value", "symbol")

  const colorArray = [
    "#AF435D",
    "#D4B957",
    "#96C24E",
    "#8A61E2",
    "#AF6343",
    "#0998B9",
    "#2ED081",
    "#9BB0CF",
  ]

  const percentageData = [
    ...dataSource.data1,
    dataSource.remainingDataSet,
  ].reduce((a, b) => a + b, 0)
  const testArray = dataSource?.data1?.map((item) =>
    decimal(multiple(div(item, percentageData), 100), 2)
  )

  const percentageSymbol = dataSource.symbolsArray?.map((item) => '%' + item )

  const data = {
    labels: [...percentageSymbol, "% Other"],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          ...testArray,
          decimal(multiple(div(dataSource.remainingDataSet, percentageData), 100), 2),
        ],
        backgroundColor: [...colorArray],
        hoverOffset: 2,
        borderColor: "#343232",
        borderWidth: 2,
        percentageInnerCutout: 40,
      },
    ],
  }

  return (
    <div className={styles.pieChart}>
      <div className={styles.chartContainer}>
        <Doughnut
          data={data}
          width={200}
          height={400}
          options={{
            legend: {
              display: false,
            },
            layout: {
              padding: 2,
            },
            maintainAspectRatio: false,
            cutoutPercentage: 40,
          }}
        />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.tabs}>
          <span
            className={styles.pl4}
            style={
              tab === 0 ? { color: "#01CDFD", textDecoration: "underLine" } : {}
            }
            onClick={() => setTab(0)}
          >
            Holdings
          </span>
          <span className={styles.pl4}>|</span>
          <span
            className={styles.pl4}
            style={
              tab === 1 ? { color: "#01CDFD", textDecoration: "underLine" } : {}
            }
            onClick={() => setTab(1)}
          >
            Farm
          </span>
          <span className={styles.pl4}>|</span>

          <span
            className={styles.pl4}
            style={
              tab === 2 ? { color: "#01CDFD", textDecoration: "underLine" } : {}
            }
            onClick={() => setTab(2)}
          >
            LPTokens
          </span>
          <span className={styles.pl4}>|</span>

          <span
            className={styles.pl4}
            style={
              tab === 3 ? { color: "#01CDFD", textDecoration: "underLine" } : {}
            }
            onClick={() => setTab(3)}
          >
            Staked
          </span>
        </div>
        <div className={styles.labels}>
          {dataSource.data1.map((item, index) => {
            return (
              <span className={styles.holdingData}>
                <span
                  style={{ color: colorArray[index] }}
                  className={styles.assetTitles}
                >
                  {`$${commas(decimal(item, 2))}`}
                </span>
                <span
                  style={{ paddingLeft: "12px" }}
                  className={styles.assetTitles}
                >
                  {dataSource.symbolsArray[index]}
                </span>
              </span>
            )
          })}
          {dataSource.remainingDataSet > 0 && (
            <span className={styles.holdingData}>
              <span style={{ color: "#9BB0CF" }} className={styles.assetTitles}>
                {`$${commas(decimal(dataSource.remainingDataSet, 2))}`}
              </span>
              <span
                style={{ paddingLeft: "4px" }}
                className={styles.assetTitles}
              >
                Other
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PortFolioChart

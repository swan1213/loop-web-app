import React, { useState } from "react"
import { lookup } from "../../libs/parse"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import styles from "./DashboardChart.module.scss"
import { lte } from "../../libs/math"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder"
import CompateAllPairsChart from "./DashboardStatsCharts/CompareAllPairsChart"
import LoopPriceChart from "./DashboardStatsCharts/LoopPriceChart"
import LiquidityChart from "./LiquidityChart"
import VolumeChart from "./VolumeChart"
import { bound } from "../../components/Boundary"
import useDashboard, { StatsNetwork } from "../../statistics/useDashboard"
import ProgressLoading from "../../components/Static/ProgressLoading"

export const Loading = () => {

  return <div className={styles.loading}>
  <ProgressLoading />
</div>
}

export const DashboardWrappper = () =>{
  const { dashboard } = useDashboard(StatsNetwork.TERRA)
  return <DashboardCharts {...dashboard} />
}
const DashboardCharts = (props: Partial<Dashboard>) => {

  return (
    <Grid className={styles.chart_container}>
      
      <Card>
        { bound(<LoopPriceChart />, <Loading />) }
      </Card>
      { bound(<LiquidityChart {...props} />, <Loading />)}

      <span style={{marginTop:'15px'}}>
        { bound(<VolumeChart {...props} />, <LoadingPlaceholder  size={"sm"} color={"lightGrey"} />)}
      </span>
      <Card>
          { bound(<CompateAllPairsChart/>, <LoadingPlaceholder size={"sm"} color={"lightGrey"} />)}
      </Card>
    </Grid>
  )
}

export default DashboardCharts

/* helpers */
export const toDatasets = (data: ChartItem[], symbol?: string) =>
  data
    .filter(({ timestamp, value }) => !lte(value, "0"))
    .map(({ timestamp, value }) => {
      return { t: timestamp, y: lookup(value, symbol, { integer: true }) }
    })

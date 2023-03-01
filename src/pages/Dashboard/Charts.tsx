import { UST, UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { formatAssetAmount, lookup, lookupSymbol } from "../../libs/parse"
import { calcChange } from "../../statistics/useYesterday"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import ChartContainer from "../../containers/ChartContainer"
import { TooltipIcon } from "../../components/Tooltip"
import Price from "../../components/Price"
import { last } from "ramda"
import { gt, lte } from "../../libs/math"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder"
import useDashboard, { StatsNetwork } from "../../statistics/useDashboard"

export const DashboardWrappper = () =>{
  const { dashboard } = useDashboard(StatsNetwork.TERRA)
  return <DashboardCharts {...dashboard} />
}

const DashboardCharts = (props: Partial<Dashboard>) => {
  
  const { latest24h, liquidityHistory, tradingVolumeHistory } = props

  return (<>
  <Card>
        <Summary
          title={
            <>
              <TooltipIcon content={Tooltip.Chart.Liquidity}>
                Liquidity
              </TooltipIcon>
              {gt(
                liquidityHistory ? last(liquidityHistory)?.value ?? "0" : "0",
                "0"
              ) ? (
                <Price
                  price={formatAssetAmount(
                    liquidityHistory ? last(liquidityHistory)?.value : "0",
                    lookupSymbol(UUSD)
                  )}
                  symbol={lookupSymbol(UUSD)}
                />
              ) : (
                <LoadingPlaceholder size={"sm"} color={"black"} />
              )}
            </>
          }
        >
          <ChartContainer
            change={
              liquidityHistory && liquidityHistory.length >= 2
                ? calcChange({
                    yesterday:
                      liquidityHistory[liquidityHistory.length - 2]?.value,
                    today: liquidityHistory[liquidityHistory.length - 1]?.value,
                  })
                : undefined
            }
            fmt={{ t: "EEE dd LLL, yy" }}
            symbol={lookupSymbol(UUSD)}
            datasets={liquidityHistory ? toDatasets(liquidityHistory, UST) : []}
          />
        </Summary>
      </Card>
    <span style={{marginTop:'15px'}}>
    {/* <Card>
        <Summary
          title={
            <>
              <TooltipIcon content={Tooltip.Chart.Volume}>Volume</TooltipIcon>
              {gt(latest24h?.volume ?? "0", "-1") ? (
                <Price
                  price={formatAssetAmount(
                    latest24h?.volume,
                    lookupSymbol(UUSD)
                  )}
                  symbol={lookupSymbol(UUSD)}
                />
              ) : (
                <LoadingPlaceholder size={"sm"} color={"black"} />
              )}
            </>
          }
        >
          <ChartContainer
            fmt={{ t: "EEE dd LLL, yy" }}
            datasets={
              tradingVolumeHistory ? toDatasets(tradingVolumeHistory, UST) : []
            }
            symbol={lookupSymbol(UUSD)}
            bar
          />
        </Summary>
      </Card> */}
    </span>
      </>
  )
}

export default DashboardCharts

/* helpers */
const toDatasets = (data: ChartItem[], symbol?: string) =>
  data
    .filter(({ timestamp, value }) => !lte(value, "0"))
    .map(({ timestamp, value }) => {
      return { t: timestamp, y: lookup(value, symbol, { integer: true }) }
    })

import { UST, UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { formatAssetAmount, lookupSymbol } from "../../libs/parse"
import { calcChange } from "../../statistics/useYesterday"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import ChartContainer from "../../containers/ChartContainer"
import { TooltipIcon } from "../../components/Tooltip"
import Price from "../../components/Price"
import { last } from "ramda"
import { gt } from "../../libs/math"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder"
import { Loading, toDatasets } from "./DashboardCharts"
import { bound } from "../../components/Boundary"
import ProgressLoading from "../../components/Static/ProgressLoading"

const LiquidityChart = (props: Partial<Dashboard>) => {
  const { liquidityHistory } = props

  return <Card>
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
                <LoadingPlaceholder size={"sm"} color={"lightGrey"} />
              )}
            </>
          }
        >
          { bound ((liquidityHistory && liquidityHistory.length >= 2) ? <ChartContainer
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
          /> : <Loading />,  <Loading />) 
          }
        </Summary>
      </Card>
}

export default LiquidityChart
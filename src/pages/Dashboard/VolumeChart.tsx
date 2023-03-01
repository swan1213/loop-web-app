import { UST, UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { formatAssetAmount, lookupSymbol } from "../../libs/parse"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import ChartContainer from "../../containers/ChartContainer"
import { TooltipIcon } from "../../components/Tooltip"
import Price from "../../components/Price"
import { gt } from "../../libs/math"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder"
import { toDatasets } from "./DashboardCharts"
import { bound } from "../../components/Boundary"
import ProgressLoading from "../../components/Static/ProgressLoading"

const VolumeChart = (props: Partial<Dashboard>) => {
  const { latest24h, tradingVolumeHistory } = props
  
  return <Card>
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
          <LoadingPlaceholder size={"sm"} color={"lightGrey"} />
        )}
      </>
    }
  >
    { bound(tradingVolumeHistory ? <ChartContainer
      fmt={{ t: "EEE dd LLL, yy" }}
      datasets={
        tradingVolumeHistory ? toDatasets(tradingVolumeHistory, UST) : []
      }
      symbol={lookupSymbol(UUSD)}
      bar
    /> : <ProgressLoading />,  <ProgressLoading />) }
  </Summary>
</Card>
}

export default VolumeChart
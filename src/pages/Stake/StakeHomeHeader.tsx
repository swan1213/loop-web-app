import Tooltip from "../../lang/Tooltip.json"
import { UUSD, LOOP } from "../../constants"
import useDashboard from "../../statistics/useDashboard"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import { TooltipIcon } from "../../components/Tooltip"
import CountWithResult from "../../containers/CountWithResult"

const StakeHomeHeader = () => {
  // const { getToken } = useProtocol()
  // const { find } = useContract()
  const { dashboard, ...result } = useDashboard()

  const contents = [
    {
      title: (
        <TooltipIcon content={Tooltip.Stake.MIRprice}>{LOOP} Price</TooltipIcon>
      ),
      content: (
        /*<CountWithResult keys={[PriceKey.PAIR]} symbol={UUSD} format={format}>
          {find(PriceKey.PAIR, getToken(LOOP))}
        </CountWithResult>*/
          <>0</>
      ),
    },

    {
      title: (
        <TooltipIcon content={Tooltip.Stake.MIRvolume}>
          {LOOP} Volume
        </TooltipIcon>
      ),
      content: (
        <CountWithResult results={[result]} symbol={UUSD} integer>
          {dashboard?.latest24h?.mirVolume}
        </CountWithResult>
      ),
    },

    {
      title: `${LOOP} Circulating Supply`,
      content: (
        <CountWithResult results={[result]} symbol={LOOP} integer>
          {dashboard?.mirCirculatingSupply}
        </CountWithResult>
      ),
    },
  ]

  return (
    <Grid>
      {contents.map(({ title, content }, index) => (
        <Card key={index}>
          <Summary title={title}>{content}</Summary>
        </Card>
      ))}
    </Grid>
  )
}

export default StakeHomeHeader

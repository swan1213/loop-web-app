import useDashboard, {StatsNetwork} from "../statistics/useDashboard";
import {useLOOPPrice} from "../data/contract/normalize";
import {div, multiple} from "../libs/math";
import {SMALLEST} from "../constants";

export default () => {
  try{
    const { dashboard } = useDashboard(StatsNetwork.TERRA)
    const LoopUstPrice = useLOOPPrice()?.contents
    const loopPrice = LoopUstPrice ? LoopUstPrice : "0"
    const tvl = dashboard?.totalValueLocked?.liquidity ?? "0"
    return div(multiple(52000000, loopPrice), div(tvl, SMALLEST)) ?? "0"
  }catch (err){
    return "0"
  }
}

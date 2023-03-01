import Tooltip from "../../lang/Tooltip.json"
import { UUSD, LOOP } from "../../constants"
import { format } from "../../libs/parse"
import { useContract, useContractsAddress } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import { TooltipIcon } from "../../components/Tooltip"
import CountWithResult from "../../containers/CountWithResult"
import styles from "./AdminHeader.module.scss"
import {useProtocol} from "../../data/contract/protocol";
import {useRecoilValue} from "recoil";
import {findPairPoolPrice} from "../../data/contract/info";

const AdminHomeHeader = () => {
  const { getToken, getPair } = useProtocol()
  const findPrice  = useRecoilValue(findPairPoolPrice)
  const price = findPrice?.(getPair(getToken(LOOP) ?? ''), getToken(LOOP) ?? '')

  const contents = [
    {
      title: (
        <TooltipIcon content={Tooltip.Stake.MIRprice}>{LOOP} Price</TooltipIcon>
      ),
      content: (
        <CountWithResult keys={[PriceKey.PAIR]} symbol={UUSD} format={format}>
          {price}
        </CountWithResult>
      ),
    },
  ]

  return (
    <Grid>
      {contents.map(({ title, content }, index) => (
        <Card key={index} className={styles.card}>
          <Summary title={title}>{content}</Summary>
        </Card>
      ))}
    </Grid>
  )
}

export default AdminHomeHeader

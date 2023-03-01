import { LOOP } from "../../constants"
import { formatAsset } from "../../libs/parse"
import { findValue } from "./receiptHelpers"
import {useFindTokenDetails} from "../../data/form/select";
import {Type} from "../../pages/Stake";
import {useFindLPFromDevToken} from "../../data/farming/stakeUnstake";
import {TxLog} from "../../types/tx";

export default (type: Type, gov: boolean) => (logs: TxLog[]) => {
  const getSymbolFn  = useFindTokenDetails()
  const val = findValue(logs)

  const amount = val("amount")
  const token = val("asset_token") || val("contract_address")

  const findLPFromDevToken = useFindLPFromDevToken()
  const lp = findLPFromDevToken(token)

  const lpSymbol = getSymbolFn(token, 'lp')?.tokenSymbol
  const devSymbol =  lp ? getSymbolFn(lp, 'lp')?.tokenSymbol : ''

  /* contents */
  return [
    {
      type:type,
      title: "Amount",
      content: formatAsset(amount, !gov ? `${lpSymbol ? lpSymbol : devSymbol ?? ""} LP` : LOOP),
    },
  ]
}

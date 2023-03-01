import { LOOP } from "../../constants"
import { formatAsset } from "../../libs/parse"
import getLpName from "../../libs/getLpName"
import { useContractsAddress } from "../../hooks"
import { findValue } from "./receiptHelpers"
import {useTokenMethods} from "../../data/contract/info";
import {TxLog} from "../../types/tx";

export default (gov: boolean,type:any) => (logs: TxLog[]) => {
  const { getSymbol } = useTokenMethods()
  const val = findValue(logs)


  // console.log("type",type)

  const amount = val("amount")
  const token = val("asset_token") || val("contract_address")
  const symbol = getSymbol(token)

  /* contents */
  return [
    {
      type:type,
      title: "Amount",
      content: formatAsset(amount, !gov ? getLpName(symbol) : LOOP),
    },
  ]
}

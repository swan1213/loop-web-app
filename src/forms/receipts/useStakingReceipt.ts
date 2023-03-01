import { LOOP } from "../../constants"
import { formatAsset } from "../../libs/parse"
import { findValue } from "./receiptHelpers"
import {TxLog} from "../../types/tx";

export default (type:any) => (logs: TxLog[]) => {
  const val = findValue(logs)

  const amount = val("amount")
  /* contents */
  return [
    {
      type:type,
      title: "Amount",
      content: formatAsset(amount, LOOP),
    },
  ]
}

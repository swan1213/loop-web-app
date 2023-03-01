import { capitalize } from "../../libs/utils"
import { formatAsset } from "../../libs/parse"
import { findValue } from "./receiptHelpers"
import {useTokenMethods} from "../../data/contract/info";
import {TxLog} from "../../types/tx";

export default () => (logs: TxLog[]) => {
  const { getSymbol } = useTokenMethods()
  const val = findValue(logs)

  const id = val("poll_id")
  const amount = val("amount")
  const token = val("contract_address")
  const answer = val("vote_option")
  const symbol = getSymbol(token)

  return [
    { title: "Poll ID", content: id },
    { title: "Deposit", content: formatAsset(amount, symbol) },
    { title: "Answer", content: answer && capitalize(answer) },
  ]
}

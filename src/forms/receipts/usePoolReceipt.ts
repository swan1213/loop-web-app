import { formatAsset } from "../../libs/parse"
import getLpName from "../../libs/getLpName"
import { useProtocol } from "../../data/contract/protocol"

import {
  findPathFromContract,
  parseTokenText
} from "./receiptHelpers"
import { Type } from "../../pages/PoolDynamic"
import { useFindTokenDetails } from "../../data/form/select";
import {useTokenMethods} from "../../data/contract/info";
import {div} from "../../libs/math";
import {TxLog} from "../../types/tx";

export default (type: Type) => (logs: TxLog[]) => {
  const { getSymbol } = useProtocol()
  const val = findValueFromLogsForPool(logs)
  const fc = findPathFromContract(logs)
  const { check8decOper } = useTokenMethods()

  const join = (array: { amount: string; token: string }[]) =>
    array
      .map(({ amount, token }) => formatAsset(check8decOper(token) ? div(amount, "100") : amount, getSymbol(token)))
      .join(" + ")

  const token = val("contract_address")
  const findTokenDetailFn = useFindTokenDetails()
  const symbol = findTokenDetailFn?.(token, 'pair')?.tokenName ?? getSymbol(token)
  const deposit = parseTokenText(val("assets", 2))
  const received = val("share", 2)
  const refund = parseTokenText(val("refund_assets"))
  const withdrawn = val("withdrawn_share")
  const withdrawnToken = fc("transfer")("contract_address")
  const withdrawnSymbol = getSymbol(withdrawnToken)

  /* contents */
  return {
    [Type.PROVIDE]: [
      {
        title: "Receive",
        content: formatAsset(received, `${symbol} LP`),
      },
      {
        title: "Deposited",
        content: join(deposit),
      },
    ],
    [Type.WITHDRAW]: [
      {
        title: "Refund",
        content: join(refund),
      },
      {
        title: "Withdrawn",
        content: formatAsset(withdrawn, getLpName(withdrawnSymbol)),
      },
    ],
  }[type]
}

export const findValueFromLogsForPool =
    (logs: TxLog[]) =>
        (key: string, index = 0) => {
          const data = logs.find((log, index)=>{
            const attribute = log?.Events.find(
                (e) => e.Type === "from_contract"
            )?.Attributes

            return attribute && attribute?.find((attr) => attr.Key === key)?.Value
          })

          const attribute = data?.Events.find(
              (e) => e.Type === "from_contract"
          )?.Attributes

          return attribute ? attribute?.find((attr) => attr.Key === key)?.Value : undefined
        }
import { LOOP } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import ExchangeForm from "../../forms/Exchange/ExchangeForm"
import { MenuKey } from "../../routes"
import useHash from "../../libs/useHash"
import { useTokenMethods } from "../../data/contract/info"
import { useState } from "react"
import { TxResult } from "@terra-money/wallet-provider"
import { PostError } from "../../forms/CustomMsgFormContainer"
import Container from "../../components/Container"
import Result from "../../forms/Result"
import useSwapReceipt from "../../forms/receipts/useSwapReceipt"
import { useFindTokenDetails } from "../../data/form/select"
import { useProtocol } from "../../data/contract/protocol"

export enum Type {
  "SWAP" = "Swap",
  "SELL" = "sell",
}
export interface EXCHANGE_TOKEN {
  token?: string
  symbol?: string
}

const DashboardExchange = () => {
  const { whitelist, getToken } = useProtocol()
  const { pair } = whitelist[getToken(LOOP)] ?? {}

  const [token1, setToken1] = useState<EXCHANGE_TOKEN | undefined>({
    token: pair ?? "",
    symbol: "UST",
  })
  const [token2, setToken2] = useState<EXCHANGE_TOKEN | undefined>({
    token: getToken(LOOP) ?? "",
    symbol: LOOP,
  })

  const { hash: type } = useHash<Type>(Type.SWAP)
  const tab = {
    tabs: [Type.SWAP],
    tooltips: [Tooltip.Trade.General],
    current: type,
  }
  const setTokens = (token1: EXCHANGE_TOKEN, token2?: EXCHANGE_TOKEN) => {
    token1.token
      ? setToken1(check8decOper(token1.token) ? token2 : token1)
      : setToken1({
          token: pair ?? "",
          symbol: "UST",
        })
    token2?.token
      ? setToken2(check8decOper(token1.token) ? token1 : token2)
      : setToken2({
          token: getToken(LOOP) ?? "",
          symbol: LOOP,
        })
  }
  const { check8decOper } = useTokenMethods()

  const [simulatedPrice, setSimulatedPrice] = useState<string>("0")
  const [response, setResponse] = useState<TxResult | undefined>(undefined)
  const [error, setError] = useState<PostError>()

  const responseFun = (
    response: TxResult | undefined,
    errorResponse?: PostError
  ) => (response ? setResponse(response) : setError(errorResponse))
  const setSimulatedPriceFunc = (price?: string) =>
    setSimulatedPrice(price ?? "0")

  const parseTx = useSwapReceipt(type, simulatedPrice)
  const reset = () => {
    setResponse(undefined)
    setError(undefined)
  }
  const findTokenDetailFn = useFindTokenDetails()
  const token1Symbol = findTokenDetailFn(token1?.token)
  const token2Symbol = findTokenDetailFn(token2?.token)

  return (
    <>
      {window.innerWidth < 600 ? (
        <></>
      ) : (
        <>
          {(response || error) && (
            <Container sm>
              <Result
                response={response}
                error={error}
                parseTx={parseTx}
                onFailure={reset}
                resetIt={"SWAP AGAIN"}
                asset={
                  token1Symbol?.tokenSymbol + "_" + token2Symbol?.tokenSymbol
                }
              />
            </Container>
          )}
          {response || error ? null : (
            <ExchangeForm
              smScreen
              type={type}
              tab={tab}
              key={type}
              setTokens={setTokens}
              responseFun={responseFun}
              setSimulatedPriceFunc={setSimulatedPriceFunc}
              isNewDesign={true}
            />
          )}
        </>
      )}
    </>
  )
}

export default DashboardExchange

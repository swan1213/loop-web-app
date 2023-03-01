import { useEffect, useState } from "react"
import { div } from "../libs/math"
import {  useFetchTokens } from "../hooks"
import { Type } from "../pages/Exchange"
import { useQuery } from "@apollo/client"
import { CONTRACT } from "../graphql/gqldocs"
import {useProtocol} from "../data/contract/protocol";

interface Params {
  amount: string
  token: string
  pair: string
  reverse: boolean
  type: Type
}

interface SimulatedData {
  return_amount: string
  offer_amount: string
  commission_amount: string
  spread_amount: string
}

interface Simulated {
  amount: string
  spread: string
  commission: string
  price: string
}
interface CONTRACTType {
  pair: string
  denom?: string
  isNative: boolean
  contract_addr: string
  tokenSymbol?: string
  tokenName?: string
}

export default ({ amount: value, token, pair, reverse, type }: Params) => {
  const [simulated, setSimulated] = useState<Simulated>()
  const { ifNative } = useFetchTokens()

  /* context */
  const { toToken, toPlainString } = useProtocol()

  const amount = toPlainString(value)

  const toNative = (tokenParam: undefined | CONTRACTType, amount: string = "0"): any => {
    try {
      return { amount: amount ?? "0", info: { native_token: { denom: token ? tokenParam?.denom ?? "" : "" } } }
    }catch (e){
      return { amount: "0", info: { native_token: { denom: "" } } }
    }
  }

  /* query */
  const nati2 = JSON.stringify(toToken({ token, amount: amount ?? "0" }));
  const nati1 = JSON.stringify(toNative(ifNative(token), amount ?? "0"));

  const variables = {
    contract: !pair || pair.length <= 0 ? undefined : pair,
    msg: !reverse
        ? `{"simulation": {"offer_asset":${ifNative(token) ? nati1  :  nati2} }}`
        : `{"reverse_simulation": { "ask_asset": ${ifNative(token)
            ? JSON.stringify(toNative(ifNative(token), amount ?? "0"))
            : JSON.stringify(toToken({ token, amount: amount ?? "0" }))}}}`,
  }

  const [parsed, setParsed] = useState<SimulatedData | undefined>(undefined)
  const { refetch, error, loading } = useQuery(CONTRACT, {
    fetchPolicy: "cache-and-network",
    skip: !variables.contract,
    variables: variables,
    onCompleted: (result) => {
      result.WasmContractsContractAddressStore.Result && setParsed(JSON.parse(result.WasmContractsContractAddressStore.Result))
    },
    onError: (error) =>{
      setParsed({return_amount: "0", offer_amount: "0", spread_amount: "0", commission_amount: "0"} as SimulatedData)
      console.log("error", error)
    }
  })

  useEffect(() => {
    refetch()
  }, [value])

  const simulatedAmount = !reverse
      ? parsed?.return_amount
      : parsed?.offer_amount

  const spread = parsed?.spread_amount
  const commission = parsed?.commission_amount

  const price = {
    [Type.SWAP]: !reverse
        ? div(amount, simulatedAmount)
        : div(simulatedAmount, amount),
    [Type.SELL]: !reverse
        ? div(simulatedAmount, amount)
        : div(amount, simulatedAmount),
  }[type]

  useEffect(() => {
    error
        ? setSimulated(undefined)
        : simulatedAmount &&
        spread &&
        commission &&
        price &&
        setSimulated({ amount: simulatedAmount, spread, commission, price })
  }, [simulatedAmount, spread, commission, price, error, loading])

  return { load: refetch, simulated, error, loading }
}

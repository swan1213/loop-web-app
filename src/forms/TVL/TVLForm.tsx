import { useRef, useState, ReactNode } from "react"
import { useLocation } from "react-router-dom"
import useNewContractMsg from "../../terra/useNewContractMsg"
import { div, multiple } from "../../libs/math"
import { useFetchTokens, usePolling, useRefetch } from "../../hooks"
import { toAmount } from "../../libs/parse"
import useForm from "../../libs/useForm"
import { placeholder, step } from "../../libs/formHelpers"
import { validate as v, validateSlippage } from "../../libs/formHelpers"
import useLocalStorage from "../../libs/useLocalStorage"
import { useContractsAddress } from "../../hooks"
import { PriceKey, BalanceKey } from "../../hooks/contractKeys"

import FormGroup from "../../components/FormGroup"
import { Type } from "../../pages/TVL"
import FormIcon from "../FormIcon"
import SetSlippageTolerance from "../SetSlippageTolerance"
import useLatest from "../useLatest"
import useSelectSwapAsset, { Config } from "./useSelectSwapAsset"
import CustomMsgFormContainer from "../CustomMsgFormContainer"
import useTVLReceipt from "../receipts/useTVLReceipt"
import {SMALLEST} from "../../constants";
import {useTokenMethods} from "../../data/contract/info";
import {useProtocol} from "../../data/contract/protocol";

enum Key {
  token1 = "token1",
  token2 = "token2",
  value1 = "value1",
  value2 = "value2",
}

interface CONTRACT {
  pair: string
  denom?: string
  isNative: boolean
  contract_addr: string
  tokenSymbol?: string
  tokenName?: string
}

const TVLForm = ({ type, tab }: { type: Type; tab: Tab }) => {
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.TOKEN

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { toToken } = useProtocol()
  const { getSymbol } = useTokenMethods()

  useRefetch([priceKey, balanceKey])
  usePolling()
  let reverse = false
  /* get all native tokens pairs from terra*/
  const {
    token1Value,
    token2Value,
    getTokenSymbol,
    getPair,
    ifNative,
  } = useFetchTokens(undefined, state)

  /* form:slippage */
  const slippageState = useLocalStorage("slippage", "5")
  const [slippageValue] = slippageState
  const slippageError = validateSlippage(slippageValue)

  /* form:validate */
  const validate = ({ value1, value2, token1, token2 }: Values<Key>) => {
    const symbol1 = getTokenSymbol(token1)
    const symbol2 = getTokenSymbol(token2)

    return {
      [Key.value1]: v.amount(value1, {
        symbol: symbol1,
        min: undefined,
        max: token1
          ? token1Value.token === token1
            ? ifNative(token1)
              ? multiple(token1Value.amount, 1000000)
              : token1Value.amount
            : undefined
          : undefined,
      }),
      [Key.value2]: v.amount(value2, {
        symbol: symbol2,
        min: undefined,
        max: reverse
          ? token2Value.token === token2
            ? ifNative(token2)
              ? multiple(token2Value.amount, SMALLEST)
              : token2Value.amount
            : undefined
          : undefined,
      }),
      [Key.token1]: v.required(token1),
      [Key.token2]: v.required(token2),
    }
  }

  /* form:hook */
  const initial = {
    [Key.value1]: "",
    [Key.value2]: "",
    [Key.token1]: "",
    [Key.token2]: "",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValues, getFields, attrs, invalid } = form
  const { value1, value2, token1, token2 } = values
  const amount1 = toAmount(value1)
  const amount2 = toAmount(value2)

  const symbol1 = getSymbol(token1)
  const symbol2 = getSymbol(token2)
  const uusd = { [Type.TVL]: "0", [Type.SELL]: "0" }[type]

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>()
  const value2Ref = useRef<HTMLInputElement>()
  const onSelect = (name: Key) => (token: string) => {
    const next: Partial<Record<Key, Partial<Values<Key>>>> = {
      [Key.token1]: { token2: name === Key.token1 ? "" : token2 },
      [Key.token2]: { token1: token === token1 ? "" : token1 },
    }
    // close token 2 select box
    setShouldClose(name === Key.token1 ? true : false)

    setValues({ ...values, ...next[name], [name]: token })
  }

  /* simulation */
  const { pair } = getPair(token1, token2)
  reverse = form.changed === Key.value2

  /* latest price */
  const { isClosed } = useLatest()

  /* render:form */
  const config1: Config = {
    token: token1,
    onSelect: onSelect(Key.token1),
    useUST: false,
    dim: (token) => isClosed(getSymbol(token)),
  }

  const config2: Config = {
    token: token2,
    otherToken: config1.token,
    onSelect: onSelect(Key.token2),
    useUST: true,
    dim: (token) => isClosed(getSymbol(token)),
  }

  const [shouldClose, setShouldClose] = useState(false)

  const select1 = useSelectSwapAsset({ priceKey, balanceKey, ...config1 })
  const select2 = useSelectSwapAsset({
    priceKey,
    balanceKey,
    ...config2,
    shouldClose,
  })

  // const delisted = whitelist[token1]?.["status"] === "DELISTED"

  const fields = getFields({
    [Key.value1]: {
      label: "From",
      input: {
        type: "number",
        step: step(symbol1),
        placeholder: placeholder(symbol1),
        autoFocus: true,
        ref: valueRef,
      },
      unit: select1.button,
      assets: select1.assets,
      focused: select1.isOpen,
    },

    [Key.value2]: {
      label: "To",
      input: {
        type: "number",
        step: step(symbol2),
        placeholder: placeholder(symbol2),
        ref: value2Ref,
        value: shouldClose ? "" : div(amount2, 1000000) ?? "",
      },
      unit: select2.button,
      assets: select2.assets,
      max: undefined,
      focused: select2.isOpen,
    },
  })

  const contents = !(value1 && token1) ? undefined : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const asset = toToken({ token: token1, amount: amount1 })

  const toNative: any = (native: CONTRACT, amount: string) => {
    return native
      ? {
          amount,
          info: {
            native_token: {
              denom: native.denom,
            },
          },
        }
      : asset
  }

  const toTokenContract = (token: string, value: string, type: string) => {
    return ifNative(token, type === 'token1' ? select1.tokenSymbol : select2.tokenSymbol)
      ? toNative(ifNative(token, type === 'token1' ? select1.tokenSymbol : select2.tokenSymbol), value)
      : toToken({ amount: value, token })
  }

  const swapContract = newContractMsg(pair, {
    limits: {
      first: toTokenContract(token1, value1, 'token1'),
      second: toTokenContract(token2, value2, 'token2'),
    },
  })

  const data = {
    [Type.TVL]: [swapContract],
    [Type.SELL]: [swapContract],
  }[type]

  const messages: ReactNode[] = []

  const disabled = invalid || !!messages?.length

  /* result */
  const parseTx = useTVLReceipt()

  const msgInfo = {
    max: "0",
    value: "0",
    symbol: getTokenSymbol(token1),
  }

  const container = {
    tab,
    attrs,
    contents,
    data,
    disabled,
    messages,
    parseTx,
    msgInfo,
  }
  const tax = { pretax: uusd, deduct: type === Type.SELL }

  return (
    <CustomMsgFormContainer {...container} {...tax}>
      <SetSlippageTolerance state={slippageState} error={slippageError} />
      <FormGroup {...fields[Key.value1]} />
      <FormIcon name="arrow_downward" />
      <FormGroup {...fields[Key.value2]} />
    </CustomMsgFormContainer>
  )
}

export default TVLForm

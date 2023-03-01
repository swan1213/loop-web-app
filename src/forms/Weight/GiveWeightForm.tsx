import { useEffect, useRef, useState } from "react"

import useNewContractMsg from "../../terra/useNewContractMsg"
import { div, multiple } from "../../libs/math"
import { toAmount } from "../../libs/parse"
import useForm from "../../libs/useForm"
import {
  placeholder,
  step,
  validate as v,
} from "../../libs/formHelpers"
import { useContractsAddress, useFetchTokens } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"

import FormGroup from "../../components/FormGroup"
import { Type } from "../../pages/GiveWeight"
import useSelectSwapAsset from "../Exchange/useSelectSwapAsset"
import CustomMsgFormContainer from "../CustomMsgFormContainer"
import useWeightReceipt from "../receipts/useWeightReceipt"
import { SMALLEST } from "../../constants"
import useAPR from "../../hooks/Farm/useAPR"
import Confirm from "../../components/Confirm"
import Count from "../../components/Count"
import {useTokenMethods} from "../../data/contract/info";
import {useProtocol} from "../../data/contract/protocol";

enum Key {
  token1 = "token1",
  value = "value",
}

interface WEIGHT {
  admin_weight: string
  apr: string
  apy: string
  asset: object
  label?: string
  liqval: string
  weight: string
}

const MIN_WEIGHT = "0"
const MAX_WEIGHT = "100"

const PoolDynamicForm = ({ type, tab }: { type: Type; tab: Tab }) => {
  const priceKey = PriceKey.PAIR
  const balanceKey = {
    [Type.WEIGHT]: BalanceKey.LPSTAKABLE,
  }[type]

  const { whitelist, contracts } = useProtocol()
  const { getSymbol } = useTokenMethods()
  const { simulated: simulatedAPRs } = useAPR()

  /* form:validate */
  const validate = ({ value, token1 }: Values<Key>) => {
    return {
      [Key.value]: v.amount(value, {
        min: MIN_WEIGHT,
        max: MAX_WEIGHT,
      }),
      [Key.token1]: v.required(token1),
    }
  }

  /* form:hook */
  const initial = {
    [Key.value]: "",
    [Key.token1]: "",
  }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value, token1 } = values

  const amount = toAmount(value)
  const symbol = getSymbol(token1)

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>()
  const onSelect = (name: Key) => (token: string) => {
    setValue(Key.token1, token)
    valueRef.current?.focus()
  }

  /* render:form */
  const config = {
    token: token1,
    onSelect: onSelect(Key.token1),
    priceKey,
    balanceKey,
    formatTokenName: undefined,
    formatPairToken: type === Type.WEIGHT ? true : undefined,
    showAsPairs: true,
  }

  const select = useSelectSwapAsset({ ...config })
  const {
    getWholePairFromLp,
    getSymbolFromContract,
    contractList,
  } = useFetchTokens()

  const delisted = whitelist[token1]?.["status"] === "DELISTED"

  const [weightList, setWeightList] = useState<WEIGHT[] | undefined>([])

  useEffect(() => {
    const weightList: WEIGHT[] | undefined =
      simulatedAPRs &&
      simulatedAPRs.map((item) => {
        const { contract_addr } = item.asset.token
        const pairs = getWholePairFromLp(contract_addr)
        const pairTokens =
          pairs &&
          pairs.asset_infos.map((asset) => {
            if (asset.native_token !== undefined) {
              return {
                name: asset?.native_token.denom ?? "",
                symbol: asset?.native_token.denom ?? "",
              }
            } else {
              if (asset.token?.contract_addr) {
                const tokenInfo = getSymbolFromContract(
                  asset.token?.contract_addr
                )

                return {
                  name: tokenInfo && tokenInfo.tokenName,
                  symbol: tokenInfo && tokenInfo.tokenSymbol,
                }
              } else {
                return { name: "", symbol: "" }
              }
            }
          })

        return {
          ...item,
          label:
            pairTokens &&
            pairTokens
              .filter((item) => item.symbol)
              .map((token) =>
                token?.symbol ? token?.symbol.toUpperCase() : token?.symbol
              )
              .join(" - "),
        }
      })
    setWeightList(weightList?.filter((item) => item.label))
  }, [simulatedAPRs, contractList])

  const fields = {
    ...getFields({
      [Key.value]: {
        label: "Weight",
        input: {
          type: "number",
          step: step(symbol),
          placeholder: placeholder(symbol),
          autoFocus: true,
          ref: valueRef,
        },
        unit: delisted ? symbol : select.button,
        max: () => setValue(Key.value, MAX_WEIGHT),
        maxValue: () => MAX_WEIGHT,
        assets: select.assets,
        focused: type === Type.WEIGHT && select.isOpen,
      },
    }),
  }

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = {
    [Type.WEIGHT]: [
      newContractMsg(contracts["loop_farm_staking"], {
        update_weight: {
          amount: div(amount, 1000),
          asset: {
            token: {
              contract_addr: token1 ?? "",
            },
          },
        },
      }),
    ],
  }[type]

  const disabled = invalid

  /* result */
  const parseTx = useWeightReceipt(type)

  const msgInfo = {
    max: multiple(MAX_WEIGHT, SMALLEST),
    value: value,
    symbol: "",
  }
  const contents = undefined
  const btnLabel = "Submit"
  const container = {
    tab,
    attrs,
    contents,
    disabled,
    data,
    parseTx,
    msgInfo,
    label: btnLabel,
  }
  const tax = { pretax: undefined, deduct: type === Type.WEIGHT }

  const content =
    weightList &&
    weightList.map((weight) => {
      return {
        title: weight.label ?? "",
        content: <Count>{div(weight.admin_weight, 1000) ?? "0"}</Count>,
      }
    })

  return (
    <CustomMsgFormContainer {...container} {...tax}>
      <FormGroup {...fields[Key.value]} />
      {<Confirm list={content} />}
    </CustomMsgFormContainer>
  )
}

export default PoolDynamicForm

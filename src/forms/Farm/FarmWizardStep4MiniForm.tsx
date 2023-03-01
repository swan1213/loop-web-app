import {useRef, useState} from "react"
import {useRecoilValue} from "recoil"
import classnames from "classnames"
import {TxResult} from "@terra-money/wallet-provider"

import useNewContractMsg from "../../terra/useNewContractMsg"
import {LOOP, SMALLEST, UST} from "../../constants"
import {div,number, sum} from "../../libs/math"
import {toAmount} from "../../libs/parse"
import useForm from "../../libs/useForm"
import {placeholder, renderBalance, step, validate as v,} from "../../libs/formHelpers"
import FormGroup from "../../components/FormGroup"
import {Type} from "../../pages/LoopStake"
import {PostError} from "../FormContainer"
import styles from "../../pages/LoopStake.module.scss"
import useStakingReceipt from "../receipts/useStakingReceipt"
import MiniFormContainer from "../MInFormContainer"
import {depositedQuery, useTokenMethods} from "../../data/contract/info"

import useFee from "../../graphql/useFee"
import useTax from "../../graphql/useTax"
import {useProtocol} from "../../data/contract/protocol"
import {useLpTokenBalancesV2Query} from "../../data/farming/FarmV2"
import Result from "../Result";

enum Key {
  value = "value",
}

interface Props {
  type: Type
  lpToken: string
  pairProp: string
}

const FarmWizardStep4MiniForm = ({
  type,
  lpToken,
                                   pairProp,
}: Props) => {
  /* context */
  const { contracts } = useProtocol()
  const { getSymbol } = useTokenMethods()

  const user_staked  = useRecoilValue<string | undefined>(depositedQuery)
  const { contents: findBalances } = useLpTokenBalancesV2Query()
  const findBalance = (token: string) => findBalances[token]

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol('')
    return { [Key.value]: type === Type.UNSTAKE ? v.required(div(user_staked, SMALLEST)) : v.amount(value, { symbol, max: div(findBalance(lpToken), SMALLEST) }) }
  }

  /* form:hook */
  const initial = { [Key.value]: type === Type.UNSTAKE ? div(user_staked, SMALLEST) : "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol('')

  const fields = getFields({
    [Key.value]: {
      label: "Amount",
      input: {
        type: "number",
        step: step(symbol),
        placeholder: placeholder(symbol),
        autoFocus: true,
        disabled: type === Type.UNSTAKE,
        setValue: setValue,
        name: Key.value
      },
      help: renderBalance(type == Type.STAKE ? div(findBalance(lpToken), SMALLEST) : user_staked, symbol),
      unit: LOOP,
      smScreen: true,
      max: undefined
    },
  })

  const contents = undefined

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = {
    [Type.STAKE]: [
      newContractMsg(lpToken, {
        increase_allowance: {
          amount,
          spender: contracts["loop_farm_staking_v4"] ?? "",
        },
      }),
      newContractMsg(lpToken, {
        send: {
          contract: contracts["loop_farm_staking_v4"] ?? "",
          amount,
          msg: "eyJzdGFrZSI6e319", //{stake:{}}
        }
      }),
    ],
    [Type.UNSTAKE]: [
    ],
  }[type as Type]

  const messages = undefined
  const disabled = invalid || !lpToken

  /* result */
  const parseTx = useStakingReceipt(type)

  const container = {
    attrs,
    contents,
    messages,
    disabled,
    data,
    parseTx,
  }

  const [response, setResponse] = useState<TxResult | undefined>()

  const fee = useFee(data?.length)
  const { calcTax } = useTax()
  const pretax = '0'
  const deduct = false
  const tax = pretax ? calcTax(pretax) : "0"
  const uusdAmount = !deduct
      ? sum([pretax ?? "0", tax, fee.amount])
      : fee.amount

  const [error, setError] = useState<PostError>()

  const responseFun = (
      response: TxResult | undefined,
      errorResponse?: PostError
  ) => (response ? setResponse(response) : setError(errorResponse))

  /* reset */
  const reset = () => {
    setResponse(undefined)
    setError(undefined)
  }

  return (response || error ? (
              <Result
                  response={response}
                  error={error}
                  parseTx={parseTx}
                  onFailure={reset}
                  gov={false}
              />
          ) : (
              <MiniFormContainer
                  farmResponseFun={responseFun}
                  {...container}
                  extResponse={response}
                  className={styles.mimiContainer}
                  customActions={() => <></>}
              >
                <section>
                  <div className={styles.stakeModalInner}>
                    Tx Fee: <b className={styles.stakeMarginLeft}>{div(uusdAmount, SMALLEST)}</b> {UST}{" "}
                  </div>
                  <div className={styles.stakeModalForm}>

                    <div className={styles.stakeModalLeft}>
                      <FormGroup {...fields[Key.value]} miniForm={true}/>
                      {/* <i>~0.000 UST</i>*/}
                    </div>
                    <div className={styles.stakeModalRight}>
                      <button className={classnames(styles.button, styles.submit_stepBtn)}
                              disabled={disabled}>{type === Type.UNSTAKE ? 'UNSTAKE' : 'STAKE'}</button>
                    </div>
                  </div>
                </section>
              </MiniFormContainer>
          ))
}

export default FarmWizardStep4MiniForm

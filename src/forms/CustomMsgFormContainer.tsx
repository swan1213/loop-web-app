import { useState } from "react"
import { ReactNode, HTMLAttributes, FormEvent } from "react"
import {Msg, Fee} from "@terra-money/terra.js"

import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { SMALLEST, UUSD } from "../constants"
import { div, gt, plus, sum } from "../libs/math"
import useHash from "../libs/useHash"
import useTax from "../graphql/useTax"
import useFee from "../graphql/useFee"

import Container from "../components/Container"
import Tab from "../components/Tab"
import Card from "../components/Card"
import Confirm from "../components/Confirm"
import FormFeedback from "../components/FormFeedback"
import Button from "../components/Button"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"

import Result from "./Result"
import useAddress from "../hooks/useAddress"
import { useWallet } from "@terra-money/wallet-provider"
import { TxResult } from "@terra-money/wallet-provider"
import { UserDenied, CreateTxFailed } from "@terra-money/wallet-provider"
import { TxFailed, TxUnspecifiedError } from "@terra-money/wallet-provider"
import ConnectListModal from "../layouts/ConnectListModal"
import { useModal } from "../containers/Modal"
import styles from "./FormContainer.module.scss"
import UstNotEnough from "../components/Static/UstNotEnough"
import { useFindBalance } from "../data/contract/normalize"
import {useLCDClient} from "../graphql/useLCDClient";
import {TitleHeader} from "../types/Types";

export type PostError =
  | UserDenied
  | CreateTxFailed
  | TxFailed
  | TxUnspecifiedError

interface Props {
  data: Msg[]
  memo?: string
  gasAdjust?: number
  asset?: string

  /** Form information */
  contents?: Content[]
  /** uusd amount for tax calculation */
  pretax?: string
  /** Exclude tax from the contract */
  deduct?: boolean
  /** Form feedback */
  messages?: ReactNode[]

  /** Submit disabled */
  disabled?: boolean
  /** Submit label */
  label?: ReactNode

  /** Render tab */
  tab?: Tab
  /** Form event */
  attrs?: HTMLAttributes<HTMLFormElement>

  /** Parser for results */
  parseTx?: ResultParser
  /** Gov tx */
  gov?: boolean

  children?: ReactNode
  partial?: boolean
  msgInfo?: { max: string; value: string; symbol: string }
  farmResponseFun?: (
    res: TxResult | undefined,
    errors: PostError | undefined,
    type?: string
  ) => void
  responseFun?: (
    res: TxResult | undefined,
    errorRes?: PostError | undefined
  ) => void
  afterSubmitChilds?: ReactNode
  slippage?: ReactNode
  title?: TitleHeader
  sm?: boolean
  showSubmitBtn?: boolean
  icon?: string | ReactNode
}

export const FormContainer = ({
  data: msgs,
  memo,
  gasAdjust = 1,
  farmResponseFun,
  responseFun,
  sm = true,
  showSubmitBtn = true,
  asset,
  ...props
}: Props) => {
  const { contents, messages, label, tab, children, slippage, title } = props
  const {
    attrs,
    pretax,
    deduct,
    parseTx = () => [],
    gov,
    msgInfo,
    afterSubmitChilds,
    icon,
  } = props

  /* context */
  const { hash } = useHash()
  const [error, setError] = useState<PostError>()

  const address = useAddress()
  const modal = useModal()

  /* tax */
  const fee = useFee(msgs?.length, gasAdjust)
  const { post } = useWallet()
  const findBalanceFn = useFindBalance()
  const { terra } = useLCDClient()
  const uusd = findBalanceFn(UUSD) ?? "0"
  const { calcTax, loading: loadingTax } = useTax()
  const tax = pretax ? calcTax(pretax) : "0"
  const uusdAmount = !deduct
    ? sum([pretax ?? "0", tax, fee.amount])
    : fee.amount

  const invalid =
    address &&
    msgInfo &&
    gt(msgInfo.value, div(msgInfo.max, SMALLEST)) &&
    !gt(uusd, uusdAmount)
      ? [`Not enough ${msgInfo.symbol ?? "balance"}`]
      : undefined

  /* confirm */
  /*const [confirming, setConfirming] = useState(false)
  const confirm = () => (hasAgreed ? submit() : setConfirming(true))
  const cancel = () => setConfirming(false)*/

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<TxResult | undefined>()
  const disabled =
    loadingTax || props.disabled || invalid || submitted || !msgs?.length

  const submit = async () => {
    setSubmitted(true)

    try {
      const { gasPrice } = fee

      const txOptions: { msgs: Msg[]; gasPrices: string; purgeQueue: boolean; memo: string | undefined, fee?: Fee } = {
        msgs,
        memo,
        gasPrices: `${gasPrice}uusd`,
        // fee: new Fee(gas, { uusd: plus(amount, !deduct ? tax : undefined) }),
        purgeQueue: true,
      }

      const signMsg = await terra.tx.create(
          [{ address: address }],
          txOptions
      )

      txOptions.fee = signMsg.auth_info.fee

      const response = await post(txOptions)
      setResponse(response)
      responseFun?.(response, undefined)
      farmResponseFun?.(response, undefined, "farm_stake")
      setSubmitted(false)
    } catch (error) {
      farmResponseFun?.(undefined, error, "farm_stake")
      responseFun?.(undefined, error)
      setError(error)
      setSubmitted(false)
    }
  }

  /* reset */
  const reset = () => {
    setSubmitted(false)
    setResponse(undefined)
    setError(undefined)
  }

  /* event */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    !disabled && submit()
  }

  /* render */
  const render = (children: ReactNode | ((button: ReactNode) => ReactNode)) => {
    const next = address
      ? {
          onClick: handleSubmit,
          children: label ?? hash ?? "Submit",
          loading: submitted,
          disabled,
        }
      : {
          onClick: () => modal.open(),
          children: MESSAGE.Form.Button.ConnectWallet,
        }

    const txFee = (
      <Count symbol={"uusd"} dp={6}>
        {plus(!deduct ? tax : 0, fee.amount)}
      </Count>
    )

    const form = (
      <>
        {children}

        {gt(uusd, div(plus(!deduct ? tax : 0, fee.amount), SMALLEST)) &&
          contents && (
            <Confirm
              list={[
                ...contents,
                {
                  title: (
                    <TooltipIcon content={Tooltip.Forms.TxFee}>
                      Gas Fee
                    </TooltipIcon>
                  ),
                  content: <span className={styles.fee}><span className={styles.approx}>&#8773;</span> {txFee}</span>,
                },
              ]}
            />
          )}

        {gt(uusd, div(plus(!deduct ? tax : 0, fee.amount), SMALLEST)) &&
          (invalid ?? messages)?.map((message, index) => (
            <FormFeedback key={index}>{message}</FormFeedback>
          ))}
        {!gt(uusd, div(plus(!deduct ? tax : 0, fee.amount), SMALLEST)) && (
          <UstNotEnough uusdAmount={txFee} />
        )}

        {showSubmitBtn && (
          <Button {...next} icon={icon} type="button" size="lg" submit />
        )}
        {afterSubmitChilds && afterSubmitChilds}
      </>
    )

    return tab ? (
      <Tab {...tab}>{form}</Tab>
    ) : (
      <Card
        hasForm
        header={title?.name ?? ""}
        slippage={slippage}
        headerClass={title?.className ?? ''}
        lg
        className={styles.card}
      >
        {form}
      </Card>
    )
  }

  return (
    <Container sm={sm}>
      {response || error ? (
        <Result
          asset={asset}
          response={response}
          error={error}
          parseTx={parseTx}
          onFailure={reset}
          gov={gov}
        />
      ) : (
        <form {...attrs} onSubmit={handleSubmit}>
          {render(children)}
        </form>
      )}
      {!address && <ConnectListModal {...modal} />}
    </Container>
  )
}

export default FormContainer

import Tooltip from "../lang/Tooltip.json"
import useNewContractMsg from "../terra/useNewContractMsg"
import { LOOP, LP } from "../constants"
import { gt, max as findMax, minus, plus } from "../libs/math"
import { formatAsset, lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import {
  placeholder,
  renderBalance,
  step,
  validate as v,
} from "../libs/formHelpers"
import getLpName from "../libs/getLpName"
import { useContract, useContractsAddress, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import FormFeedback from "../components/FormFeedback"
import { Type } from "../pages/Stake"
import useStakeReceipt from "./receipts/useStakeReceipt"
import FormContainer from "./FormContainer"
import Button from "../components/Button"
import MESSAGE from "../lang/MESSAGE.json"
import { useState } from "react"
import useFee from "../graphql/useFee"
import styles from "./Stake.module.scss"
import { TxResult } from "@terra-money/wallet-provider"
import { Fee } from "@terra-money/terra.js/dist/core/Fee"


import { useWallet } from "@terra-money/wallet-provider"
import {useTokenMethods} from "../data/contract/info";
import {useProtocol} from "../data/contract/protocol";
import {useStakedLoop, useUnstakedQueue} from "../data/contract/migrate";
import {Msg} from "@terra-money/terra.js";
import useAddress from "../hooks/useAddress";
import {useLCDClient} from "../graphql/useLCDClient";

enum Key {
  value = "value",
}

interface Props {
  type: Type
  token: string
  tab?: Tab
  /** Gov stake */
  gov?: boolean
}

const FarmStakeFarm = ({ type, token, tab, gov }: Props) => {
  const balanceKey = (!gov
    ? {
        [Type.STAKE]: BalanceKey.LPSTAKABLE,
        [Type.UNSTAKE]: BalanceKey.LPSTAKED,
      }
    : {
        [Type.STAKE]: BalanceKey.TOKEN,
        [Type.UNSTAKE]: BalanceKey.MIRGOVSTAKED,
      })[type as Type]

  /* context */
  const { contracts } = useProtocol()
  const { getSymbol } = useTokenMethods()
  const { find, parsed } = useContract()
  useRefetch([balanceKey, !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED])

  const { contents: stakedLoop } = useStakedLoop()
  const getLocked = () =>
    findMax(
      parsed[BalanceKey.MIRGOVSTAKED]?.locked_balance?.map(
        ([, { balance }]: LockedBalance) => balance
      ) ?? [0]
    )

  const lockedIds = parsed[BalanceKey.MIRGOVSTAKED]?.locked_balance
    ?.map(([id]: LockedBalance) => id)
    .join(", ")

  const getMax = () => {
    const balance = find(balanceKey, token)
    const locked = getLocked()

    return gov && type === Type.UNSTAKE && gt(locked, 0)
      ? minus(balance, locked)
      : type === Type.UNSTAKE
      ? stakedLoop !== undefined
        ? stakedLoop
        : "0"
      : balance
  }

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol(token)
    return { [Key.value]: v.amount(value, { symbol, max: getMax() }) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)

  /* render:form */
  const max = getMax()
  const locked = getLocked()
  const fields = getFields({
    [Key.value]: {
      label: "Amount",
      input: {
        type: "number",
        step: step(symbol),
        placeholder: placeholder(symbol),
        autoFocus: true,
      },
      help: renderBalance(max, symbol),
      unit: gov ? LOOP : LP,
      max: gt(max, 0)
        ? () => setValue(Key.value, lookup(max, symbol))
        : undefined,
      maxValue: gt(max, 0)
          ? () => lookup(max, symbol)
          : undefined,
    },
  })

  /* confirm */
  const staked = find(
    !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED,
    token
  )

  const contents = !value
    ? undefined
    : gt(staked, 0)
    ? [
        {
          title: "Staked",
          content: formatAsset(staked, !gov ? getLpName(symbol) : LOOP),
        },
      ]
    : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { getToken } = useProtocol()
  const data = {
    [Type.STAKE]: [
      newContractMsg(token, {
        increase_allowance: {
          amount,
          spender: contracts["loop_staking"] ?? "",
        },
      }),
      newContractMsg(contracts["loop_staking"] ?? "", {
        stake_amount: {
          asset: {
            token: {
              contract_addr: getToken(LOOP),
            },
          },
          amount,
        },
      }),
    ],
    [Type.UNSTAKE]: [
      newContractMsg(contracts["loop_staking"], {
        unstake_amount: {
          asset: {
            token: {
              contract_addr: getToken(LOOP),
            },
          },
          amount,
        },
      }),
    ],
  }[type as Type]

  const messages =
    gov && type === Type.UNSTAKE && gt(locked, 0)
      ? [`${formatAsset(locked, LOOP)} are voted in poll ${lockedIds}`]
      : undefined

  const disabled = invalid

  /* result */
  const parseTx = useStakeReceipt(!!gov,type)

  const container = { tab, attrs, contents, messages, disabled, data, parseTx }

  const { timeRequired, pendingUnstake, canClaim } = useUnstakedQueue()

  const [response, setResponse] = useState<TxResult | undefined>()
  const fee = useFee()
  const { post } = useWallet()
  const address =  useAddress()
  const { terra } = useLCDClient()

  const claimMsg = [
    newContractMsg(contracts["loop_staking"] ?? "", {
      unstake: {},
    }),
  ]

  const confirmClaim = async () => {
    const { gasPrice } = fee
    const txOptions: { msgs: Msg[]; gasPrices: string; purgeQueue: boolean; memo: string | undefined, fee?: Fee } = {
      msgs: claimMsg,
      memo: undefined,
      gasPrices: `${gasPrice}uusd`,
      // fee: new Fee(gas, { uusd: plus(amount, !deduct ? tax : undefined) }),
      // fee: new Fee(gas, { uusd: plus(feeAmount, undefined) }),
      purgeQueue: true,
    }

    const signMsg = await terra.tx.create(
        [{ address: address }],
        txOptions
    )

    txOptions.fee = signMsg.auth_info.fee

    const extResponse = await post(txOptions)

    setResponse(extResponse)
  }

  const next = {
    onClick: confirmClaim,
    children: "Claim",
    disabled: !canClaim || (pendingUnstake && pendingUnstake?.time <= 0),
    className: styles.claim,
  }

  const afterSubmitChilds = timeRequired && type === Type.UNSTAKE && (
    <>
      {!canClaim && timeRequired && (
        <FormFeedback>You can claim after {timeRequired}</FormFeedback>
      )}
      {pendingUnstake && pendingUnstake?.time <= 0 && (
        <FormFeedback>{MESSAGE.GOV_STAKE.unstake_first}</FormFeedback>
      )}

      <Button {...next} type="button" size="lg" submit />
    </>
  )

  return (
    <FormContainer
      farmResponseFun={() => {}}
      {...container}
      extResponse={response}
      afterSubmitChilds={afterSubmitChilds}
    >
      <FormGroup {...fields[Key.value]} />

      {gov && type === Type.STAKE && (
        <FormFeedback help>{Tooltip.My.GovReward}</FormFeedback>
      )}
    </FormContainer>
  )
}

export default FarmStakeFarm

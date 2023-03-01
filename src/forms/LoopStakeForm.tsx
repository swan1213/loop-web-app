import useNewContractMsg from "../terra/useNewContractMsg"
import {LOOP, LP, SMALLEST} from "../constants"
import {div, gt, max as findMax, minus, plus} from "../libs/math"
import {decimal, formatAsset, lookup, numbers, toAmount} from "../libs/parse"
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
import {Type, useCalculateStakeAPY} from "../pages/LoopStake"
import FormContainer, { PostError } from "./FormContainer"
import Button from "../components/Button"
import MESSAGE from "../lang/MESSAGE.json"
import { FormEvent, useState } from "react"
import useFee from "../graphql/useFee"
import styles from "./Stake.module.scss"
import { TxResult } from "@terra-money/wallet-provider"
import { Fee } from "@terra-money/terra.js/dist/core/Fee"


import { useWallet } from "@terra-money/wallet-provider"
import Grid from "../components/Grid"
import Price from "../components/Price"
import { icons } from "../routes"
import {useFindBalance} from "../data/contract/normalize";
import {useRecoilValue} from "recoil";
import {getTotalStakedForStakingQuery} from "../data/contract/staking";
import {getTokensDistributedPerDayQuery} from "../data/airdrop/airdrop";
import {depositedQuery, useTokenMethods} from "../data/contract/info";
import useStakingReceipt from "./receipts/useStakingReceipt";
import {useProtocol} from "../data/contract/protocol";
import {useUnstakedQueue} from "../data/contract/migrate";
import {Msg} from "@terra-money/terra.js";
import useAddress from "../hooks/useAddress";
import {useLCDClient} from "../graphql/useLCDClient";

enum Key {
  value = "value",
}

export interface CustomActions {
  onClick: ((e: FormEvent<Element>) => void) | undefined
  children: string
  loading?: undefined | boolean
  disabled?: undefined | boolean | string[]
}

interface Props {
  type: Type
  token: string
  tab?: Tab
  /** Gov stake */
  gov?: boolean
  className?: string
  tabLabels?: { [index: string]: string }
  farmResponseFun?: (
    res: TxResult | undefined,
    err?: PostError | undefined
  ) => void
}

const LoopStakeFarm = ({
  type,
  token,
  tab,
  gov,
  className,
  tabLabels,
  farmResponseFun,
}: Props) => {
  const balanceKey = (
    !gov
      ? {
          [Type.STAKE]: BalanceKey.LPSTAKABLE,
          [Type.UNSTAKE]: BalanceKey.LPSTAKED,
        }
      : {
          [Type.STAKE]: BalanceKey.TOKEN,
          [Type.UNSTAKE]: BalanceKey.MIRGOVSTAKED,
        }
  )[type as Type]

  /* context */
  const { contracts } = useProtocol()
  const { getSymbol } = useTokenMethods()
  const { find, parsed } = useContract()
  useRefetch([balanceKey, !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED])

  const getLocked = () =>
    findMax(
      parsed[BalanceKey.MIRGOVSTAKED]?.locked_balance?.map(
        ([, { balance }]: LockedBalance) => balance
      ) ?? [0]
    )

  const lockedIds = parsed[BalanceKey.MIRGOVSTAKED]?.locked_balance
    ?.map(([id]: LockedBalance) => id)
    .join(", ")

  const { getToken } = useProtocol()
  const findBalance = useFindBalance()

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol(token)
    return { [Key.value]: v.amount(value, { symbol, max: findBalance(getToken(LOOP)) }) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)

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
      help: renderBalance(findBalance(getToken(LOOP)), symbol),
      unit: gov ? LOOP : LP,
      smScreen: true,
      max: gt(findBalance(getToken(LOOP)), 0)
        ? () => setValue(Key.value, lookup(findBalance(getToken(LOOP)), symbol))
        : undefined,
      maxValue: gt(findBalance(getToken(LOOP)), 0)
          ? () => lookup(findBalance(getToken(LOOP)), symbol)
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
  const data = {
    [Type.STAKE]: [
      newContractMsg(token, {
        increase_allowance: {
          amount,
          spender: contracts["loop_staking"] ?? "",
        },
      }),
      newContractMsg(token, {
        send: {
          contract: contracts["loop_staking"],
          amount,
          msg: "eyJzdGFrZSI6e319", //{stake:{}}
        }
      }),
    ],
    [Type.UNSTAKE]: [],
  }[type as Type]

  const messages =
    gov && type === Type.UNSTAKE && gt(locked, 0)
      ? [`${formatAsset(locked, LOOP)} are voted in poll ${lockedIds}`]
      : undefined

  const disabled = invalid

  /* result */
  const parseTx = useStakingReceipt(type)

  const container = {
    tab,
    attrs,
    contents,
    messages,
    disabled,
    data,
    parseTx,
    tabLabels,
  }

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

  const tokensDistributedPerDay = useRecoilValue(getTokensDistributedPerDayQuery)

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
  const user_staked  = useRecoilValue((depositedQuery))
  const totalTokenStaked = useRecoilValue(getTotalStakedForStakingQuery)
  const apy = useCalculateStakeAPY(div(user_staked ?? "0", SMALLEST),div(totalTokenStaked ?? "0", SMALLEST))

  const actions = (data: CustomActions) => {
    if (data) {
      return (
        <Grid className={styles.formAction}>
          <Grid className={styles.action_stats}>
            <Grid className={styles.distributed_day}>
              <h5>Tokens Distributed per day</h5>
              <Price classNames={styles.pricing} price={numbers(div(tokensDistributedPerDay, SMALLEST))} symbol={LOOP} />
            </Grid>
            <Grid className={styles.apr}>
              <h5>APR</h5>
              <Price classNames={styles.pricing} price={numbers(decimal(apy, 2))} symbol={"%"} />
            </Grid>
          </Grid>
          <Grid className={styles.submit}>
              <Button
                {...data}
                children={
                  data.children ? (
                    <div className={styles.CZflex}>
                      <img
                        src={icons["plus"]}
                        height={20}
                        alt={""}
                        width={20}
                      />
                      <div className={styles.buttonTxt}>{data.children}</div>
                    </div>
                  ) : (
                    "Submit"
                  )
                }
                type="button"
                size="lg"
                className={styles.submitBtn}
              />
          </Grid>
        </Grid>
      )
    }
  }

  return (
    <FormContainer
      farmResponseFun={farmResponseFun}
      {...container}
      extResponse={response}
      afterSubmitChilds={afterSubmitChilds}
      className={className}
      customActions={actions}
    >
      <FormGroup {...fields[Key.value]} />
      <br />
      <p><b>NOTE: Stake LOOP for 12 months.</b></p>
      <p>*Any funds unstaked prior to 12 months will forfeit all rewards.</p>
      <p>*Unstake without rewards will be enabled on 17th Dec</p>
    </FormContainer>
  )
}

export default LoopStakeFarm

import useNewContractMsg from "../../terra/useNewContractMsg"
import {LOOP, LP, SMALLEST, UST} from "../../constants"
import {div, gt, lte, max as findMax, number} from "../../libs/math"
import {formatAsset, toAmount} from "../../libs/parse"
import useForm from "../../libs/useForm"
import {placeholder, renderBalance, step, validate as v,} from "../../libs/formHelpers"
import getLpName from "../../libs/getLpName"
import {useContract, useContractsAddress, useRefetch} from "../../hooks"
import {BalanceKey} from "../../hooks/contractKeys"

import FormGroup from "../../components/FormGroup"
import {StakeDuration, Type} from "../../pages/LoopStake"
import {PostError} from "../FormContainer"
import {FormEvent, useState} from "react"
import useFee from "../../graphql/useFee"
import styles from "../../pages/LoopStake.module.scss"
import {TxResult} from "@terra-money/wallet-provider"
import {useFindBalance} from "../../data/contract/normalize";
import useStakingReceipt from "../receipts/useStakingReceipt";
import MiniFormContainer from "../MInFormContainer";
import {useRecoilValue} from "recoil";
import {depositedQuery, useTokenMethods} from "../../data/contract/info";
import {deposited18MonQuery, deposited3MonQuery} from "../../data/stake/stake18Mon";
import classNames from "classnames";
import {useProtocol} from "../../data/contract/protocol";

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
  timeLeft?: number
  duration: StakeDuration
  tabLabels?: { [index: string]: string }
  farmResponseFun?: (
    res: TxResult | undefined,
    err?: PostError | undefined
  ) => void
}

const LoopStakeMinFarm = ({
  type,
  token,
  tab,
  gov,
  className,
                            duration,
  tabLabels,
                            timeLeft,
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

  const deposited:any =  {
    [StakeDuration["12MON"]]: depositedQuery,
    [StakeDuration["18MON"]]: deposited18MonQuery,
    [StakeDuration["3MON"]]: deposited3MonQuery
  }[duration]

  const user_staked  = useRecoilValue<string | undefined>(deposited)

  const { getToken } = useProtocol()
  const findBalance = useFindBalance()
  const [agree, setAgree] = useState(false)

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol(token)
    return { [Key.value]: type === Type.UNSTAKE ? v.required(div(user_staked, SMALLEST)) : v.amount(value, { symbol, max: findBalance(getToken(LOOP)) }) }
  }

  /* form:hook */
  const initial = { [Key.value]: type === Type.UNSTAKE ? div(user_staked, SMALLEST) : "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)


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
      help: renderBalance(type == Type.STAKE ? findBalance(getToken(LOOP)) : user_staked, symbol),
      unit: gov ? LOOP : LP,
      smScreen: true,
      max: undefined
    },
  })

  /* confirm */

  const contents = undefined

  const contract:any =  {
    [StakeDuration["12MON"]]: contracts["loop_staking"] ?? "",
    [StakeDuration["18MON"]]: contracts["loop_staking_18"] ?? "",
    [StakeDuration["3MON"]]: contracts["loop_staking_3"] ?? ""
  }[duration]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = {
    [Type.STAKE]: [
      newContractMsg(token, {
        increase_allowance: {
          amount,
          spender: contract,
        },
      }),
      newContractMsg(token, {
        send: {
          contract: contract,
          amount,
          msg: "eyJzdGFrZSI6e319", //{stake:{}}
        }
      }),
    ],
    [Type.UNSTAKE]: [
      newContractMsg(contract, {
        unstake: {
          amount: user_staked,
          is_reward_claim: !agree
        },
      }),
    ],
  }[type as Type]

  const messages = undefined

  const disabled = invalid || (!agree && timeLeft !== undefined && !(lte(number(timeLeft), "0")))

  /* result */
  const parseTx = useStakingReceipt(type)

  const container = {
    attrs,
    contents,
    messages,
    disabled,
    data,
    parseTx,
    tabLabels,
  }

  const [response, setResponse] = useState<TxResult | undefined>()
  /*const fee = useFee()
  const { post } = useWallet()*/


  /*const confirmClaim = async () => {
    try{
      const { gas, amount: feeAmount } = fee
      const txOptions = {
        msgs: data,
        fee: new StdFee(gas, { uusd: plus(feeAmount, undefined) }),
        purgeQueue: true,
      }

      const extResponse = await post(txOptions)

      setResponse(extResponse)
      farmResponseFun && farmResponseFun(extResponse)
    }catch (err){
      farmResponseFun && farmResponseFun(undefined, err)
    }
  }*/

  const { amount: uusdFee } = useFee()

  return (
    <MiniFormContainer
      farmResponseFun={farmResponseFun}
      {...container}
      extResponse={response}
      className={styles.mimiContainer}
      customActions={()=><></>}
    >
      <div className={styles.stakeModal}>
        { type === Type.UNSTAKE && gt(number(timeLeft ?? "0"), "0") && (
            <label className={styles.checkBoxCheck}><input onChange={()=> setAgree(!agree)} type="checkbox"/><span></span>Yes, I’m sure I want to unstake everything without rewards.</label>
        )}
      <section>
        {
          type === Type.UNSTAKE && (
                <div className={styles.stakeModalInner}>
                  Tx Fee: <b className={classNames(styles.stakeMarginLeft, styles.fee)}>≅ {div(uusdFee, SMALLEST)}</b> {UST}{" "}
                </div>
            )
        }
        { type === Type.STAKE && (<>
          <div className={styles.stakeModalInner}>
            Balance: <b className={styles.stakeMarginLeft}>{div(findBalance(getToken(LOOP)), SMALLEST)}</b> {LOOP}{" "}
          </div>
          <div className={styles.slippagePax}>
          <span
              onClick={() => setValue(Key.value, type == Type.STAKE ? div(findBalance(getToken(LOOP)), SMALLEST) : div(user_staked ?? "0", SMALLEST))}
          >
            MAX
          </span>
          </div>
        </>) }
        <div className={styles.stakeModalForm}>
          <div className={styles.stakeModalLeft}>
            <FormGroup {...fields[Key.value]} miniForm={true} />
           {/* <i>~0.000 UST</i>*/}
          </div>
          <div className={styles.stakeModalRight}>
            <button className={styles.button} disabled={disabled} >{ type === Type.UNSTAKE ? 'UNSTAKE' : 'STAKE' }</button>
          </div>
        </div>
      </section>
      </div>
    </MiniFormContainer>
  )
}

export default LoopStakeMinFarm

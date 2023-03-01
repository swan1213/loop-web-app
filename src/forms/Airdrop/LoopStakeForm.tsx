import {useEffect, useState} from "react"
import {useRecoilValue} from "recoil"
import {TxResult} from "@terra-money/wallet-provider"

import {div, gt} from "../../libs/math"
import {insertIf} from "../../libs/utils"
import Tooltip from "../../lang/Tooltip.json"
import useNewContractMsg from "../../terra/useNewContractMsg"
import {LOOP, SMALLEST} from "../../constants"
import {formatAsset, numbers, toAmount} from "../../libs/parse"
import useForm from "../../libs/useForm"
import {validate as v,} from "../../libs/formHelpers"
import getLpName from "../../libs/getLpName"
import FormFeedback from "../../components/FormFeedback"
import {Type} from "../../pages/LoopStake"
import FormContainer, {PostError} from "../FormContainer"
import {depositedQuery, useTokenMethods} from "../../data/contract/info"
import styles from "../Form.module.scss"
import Confirm from "../../components/Confirm"
import useStakingReceipt from "../receipts/useStakingReceipt"
import {useProtocol} from "../../data/contract/protocol"

enum Key {
  value = "value",
}

interface Props {
  type: Type
  token: string
  tab?: Tab
  /** Gov stake */
  gov?: boolean
  farmResponseFun?: (res: TxResult | undefined, err?: PostError | undefined) => void
}

const LoopStakeFarm = ({ type, token, tab, gov, farmResponseFun }: Props) => {

  /* context */
  const { contracts } = useProtocol()
  const { getSymbol } = useTokenMethods()
  const [agree, setAgree] = useState(false)

  const user_staked  = useRecoilValue((depositedQuery))

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    return { [Key.value]: v.amount(value, { max: div(user_staked, SMALLEST) }) }
  }

  /* form:hook */
  const initial = { [Key.value]: div(user_staked, SMALLEST) }
  const form = useForm<Key>(initial, validate)
  const { values, attrs,setValue, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)

  useEffect(()=>{
    setValue(Key.value, div(user_staked, SMALLEST))
  }, [user_staked])

  /* render:form */
  // const max = getMax()

  /*const fields = getFields({
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
    },
  })*/

  /* confirm */
  const staked = div(user_staked, SMALLEST)


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
        unstake: {
          amount: div(user_staked, SMALLEST),
          is_reward_claim: !agree
        },
      }),
    ],
  }[type as Type]
  // const stakedTIme = useRecoilValue(getUserStakedTimeforUnstakeQuery)
  // const {  timeString, formatTime, timeLeft }  = useUnstakedTimeoutForStaking(stakedTIme ?? "0", StakeDuration.12MON)

  const messages = undefined
  const disabled = invalid /*|| (!agree && !(lte(number(timeLeft), "0")))*/

  /* result */
  const parseTx = useStakingReceipt(type)

  const container = { tab, attrs, contents, messages, disabled, data, parseTx, label: type }


  return (
    <FormContainer
      farmResponseFun={farmResponseFun}
      {...container}
    >

      <br />
      {type === Type.UNSTAKE && (
          <Confirm
              className={styles.confirm}
              list={[
                ...insertIf(type === Type.UNSTAKE, {
                  title: "Amount",
                  content: (
                      <div className={styles.unstake_content}>
                        {numbers(div(user_staked, SMALLEST))}{" "}
                      </div>
                  ),
                }),
              ]}
          />
      )}

      <br />
     {/* {type === Type.UNSTAKE && (timeString && gt(number(timeLeft), "0")) && (
          <FormFeedback notice={true}>
            Check this checkbox if you want to unstake without rewards.
          </FormFeedback>
      )}*/}
     {/* {type === Type.UNSTAKE && (timeString && gt(number(timeLeft), "0")) && (
          <>
            <input
                type={"checkbox"}
                checked={agree}
                id={"agree"}
                onChange={(e) => setAgree(!agree)}
            />{" "}
            <label htmlFor={"agree"}>
              Yes, I'm sure I want to unstake without reward
            </label>
          </>
      )}*/}
      {/*{type === Type.UNSTAKE && (timeString && gt(number(timeLeft), "0")) && (
          <Grid>
            {timeLeft && timeString.length > 0 ? (
                <span className={styles.timeLeftSection}>
              {timeString && gt(number(timeLeft), "0") && (
                  <span className={styles.timeLeft}>Time Left </span>
              )}
                  {formatTime && gt(number(timeLeft), "0") ? `${formatTime}` : ""}
            </span>
            ) : (
                <span>(Few days left)</span>
            )}
          </Grid>
      )}*/}
      {gov && type === Type.STAKE && (
        <FormFeedback help>{Tooltip.My.GovReward}</FormFeedback>
      )}
    </FormContainer>
  )
}

export default LoopStakeFarm

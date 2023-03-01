import useNewContractMsg from "../../terra/useNewContractMsg"
import {LOOP, SMALLEST, UST} from "../../constants"
import {div, gt, multiple, number, plus, sum} from "../../libs/math"
import useForm from "../../libs/useForm"
import {placeholder, renderBalance, step, validate as v,} from "../../libs/formHelpers"

import FormGroup from "../../components/FormGroup"
import {Type} from "../../pages/LoopStake"
import {PostError} from "../FormContainer"
import {useEffect, useState} from "react"
import styles from "../../pages/LoopStake.module.scss"
import {TxResult} from "@terra-money/wallet-provider"
import {useFindBalance, usePairPool} from "../../data/contract/normalize"
import useStakingReceipt from "../receipts/useStakingReceipt"
import MiniFormContainer from "../MInFormContainer"
import {useTokenMethods} from "../../data/contract/info"
import classnames from "classnames"
import useFee from "../../graphql/useFee"
import useTax from "../../graphql/useTax"
import {useProtocol} from "../../data/contract/protocol"
import {
  FarmContractTYpe,
  useFindDevTokensByLpFarm2,
  useFindStakedByUserFarmQueryFarm2,
  useFindUsersStakedTimeFarm2
} from "../../data/farming/FarmV2"
import {FarmType} from "../../pages/FarmBeta"
import {useUnstakeTimoutFarm2} from "../../graphql/queries/Farm/useUnstakedTimeout"
import useStep from "../../hooks/Farm/useStep"
import { useHistory } from "react-router-dom"

enum Key {
  value = "value",
}

interface Props {
  type: Type
  lpToken: string
  farmType: FarmContractTYpe
  farmResponseFun?: (
    res: TxResult | undefined,
    err?: PostError | undefined
  ) => void
}

const FarmWizardStep1MiniForm = ({
  type,
  lpToken,
  farmResponseFun,
                                   farmType,
}: Props) => {

  /* context */
  const { contracts, getToken } = useProtocol()
  const { getSymbol } = useTokenMethods()
  const findStakedByUserFarmFn = useFindStakedByUserFarmQueryFarm2(farmType)
  // const getDevTokens = useRecoilValue(getDevTokensByLpFarm2(FarmContractTYpe.Farm3))

  const findStaked  = findStakedByUserFarmFn(lpToken) ?? "0"
  const user_staked = div(findStaked, SMALLEST)
  const findBalance = useFindBalance()
  const [agree, setAgree] = useState(false)
  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol('')
    return { [Key.value]: type === Type.UNSTAKE ? v.required(user_staked) : v.amount(value, { symbol, max: findBalance(getToken(LOOP)) }) }
  }

  /* form:hook */
  const initial = { [Key.value]: type === Type.UNSTAKE ? div(user_staked, SMALLEST) : "" }
  const form = useForm<Key>(initial, validate)
  const { setValue, getFields, attrs, invalid } = form
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
      help: renderBalance(type == Type.STAKE ? findBalance(getToken(LOOP)) : user_staked, ''),
      unit: LOOP,
      smScreen: true,
      max: undefined,
      inputClass: true
    },
  })

  useEffect(()=>{
    user_staked && setValue(Key.value, user_staked)
  },[user_staked])

  const contents = undefined

  const contract:any = contracts[farmType] ?? ""

  const FindDevTokensByLpFarm2 = useFindDevTokensByLpFarm2(farmType)
  const devTokenFarm2 = FindDevTokensByLpFarm2?.(lpToken ?? "")

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = {
    [Type.STAKE]: [],
    [Type.UNSTAKE]: [
      newContractMsg(devTokenFarm2 ?? '', {
        send: {
          contract: contract,
          amount: multiple(user_staked, SMALLEST),
          msg: "eyJ1bnN0YWtlX2FuZF9jbGFpbSI6e319", //{unstake_and_claim:{}}
        },
      })
    ],
  }[type as Type]

  const messages = undefined
  const disabled = invalid

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

  const findUserStakedTimeFarm2Fn = useFindUsersStakedTimeFarm2(farmType)
  const { timeLeft: timeLeftv2, unStakeTimeLeft } = useUnstakeTimoutFarm2(
      findUserStakedTimeFarm2Fn?.(lpToken ?? ""), farmType, lpToken ?? ""
  )
  const { shortDayString, shortFormatTime} = unStakeTimeLeft

  return (
    <MiniFormContainer
      farmResponseFun={farmResponseFun}
      {...container}
      extResponse={response}
      className={styles.mimiContainer}
      customActions={()=><></>}
        // label={'UNFARM'}
    >
      <section>
        <div className={styles.timeLeft}>
          {
            gt(user_staked, "0") && (
                type === Type.UNSTAKE && (([FarmType.farm2, FarmType.farm3].includes(FarmType.farm3) && gt(number(timeLeftv2), "0"))) ? (
                    <p className={styles.msg}>Your min 2 week farming period is not over. Unstake without rewards? Partial withdrawals will be supported in the future.</p>
                ) : (
                    <div className={styles.letsUnstakeMsg}>
                      <p>Lets get you migrated to the new Farm and Pool!. </p>
                      <p>Follow 3 simple steps to migrate to the new audited contracts! Now you’ll have a button to Harvest rewards, and have the option to auto daily compound for true APY (min farm period will increase)</p>
                    </div>
                )
            )
          }

          {
            gt(user_staked, "0") && (
                gt(number(timeLeftv2 ?? "0"), "0") && (<div className={styles.stakeModalMiddle}>
                      <b>Time left:</b>
                      <div>
                        <>
                          <b className={styles.pinkColor}>{shortDayString}</b><i>{shortDayString && "D"}</i><b className={styles.pinkColor}>{shortFormatTime}</b><i>m</i>
                        </>
                      </div>
                    </div>
                )
            )
          }

          {
            gt(user_staked, "0") && (
                type === Type.UNSTAKE && (([FarmType.farm2, FarmType.farm3].includes(FarmType.farm3) && gt(number(timeLeftv2), "0"))) && (
                    <>
                      <input
                          type={"checkbox"}
                          checked={agree}
                          id={"agree"}
                          onChange={(e) => setAgree(!agree)}
                      />{" "}
                      <label htmlFor={"agree"}>
                        Yes, I'm sure I want to unstake without rewards.
                      </label>
                    </>
                ))
          }

        </div>
        <div className={styles.stakeModalInner}>
          Tx Fee: <b className={styles.stakeMarginLeft}>{div(uusdAmount, SMALLEST)}</b> {UST}{" "}
        </div>
        <div className={styles.stakeModalForm}>
          <div className={styles.stakeModalLeft}>
            <FormGroup {...fields[Key.value]} miniForm={true} />
           {/* <i>~0.000 UST</i>*/}
          </div>
          <div className={styles.stakeModalRight}>
            <button className={classnames(styles.button, styles.submit_stepBtn)} disabled={disabled || (!agree && gt(number(timeLeftv2), "0"))} >{ type === Type.UNSTAKE ? 'UNFARM' : 'STAKE' }</button>
          </div>
        </div>
      </section>
    </MiniFormContainer>
  )
}

export default FarmWizardStep1MiniForm
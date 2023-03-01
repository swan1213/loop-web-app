import {useEffect, useState} from "react"
import {TxResult} from "@terra-money/wallet-provider"

import {div, gt, multiple, number} from "../../libs/math"
import Tooltip from "../../lang/Tooltip.json"
import {LP, SMALLEST} from "../../constants"
import {insertIf} from "../../libs/utils"
import {decimal, lookup, toAmount} from "../../libs/parse"
import {placeholder, renderBalance, step, validate as v,} from "../../libs/formHelpers"
import FormGroup from "../../components/FormGroup"
import FormFeedback from "../../components/FormFeedback"
import useForm from "../../libs/useForm"
import {Type} from "../../pages/Stake"
import CustomMsgFormContainer from "../CustomMsgFormContainer"
import {PostError} from "../FormContainer"
import {useLpTokenBalancesQuery,} from "../../data/contract/normalize"
import {useFindDevTokensByLp, useFindUsersStakedTime,} from "../../data/farming/stakeUnstake"
import styles from "../Form.module.scss"
import useUnstakedTimeout, {useUnstakeTimoutFarm2} from "../../graphql/queries/Farm/useUnstakedTimeout"
import Grid from "../../components/Grid"
import {useFindTokenDetails} from "../../data/form/select"
import Confirm from "../../components/Confirm"
import {useFindStakedByUserFarmQuery} from "../../data/contract/farming"
import useNewContractMsg from "../../terra/useNewContractMsg"
import useFarmStakeReceipt from "../receipts/useFarmStakeReceipt"
import {FarmType, useFarmPage} from "../../pages/FarmBeta"
import {
  FarmContractTYpe,
  useFindDevTokensByLpFarm2,
  useFindStakedByUserFarmQueryFarm2,
  useFindUsersStakedTimeFarm2,
  useLpTokenBalancesV2Query
} from "../../data/farming/FarmV2"
import {useTokenMethods} from "../../data/contract/info"
import {useProtocol} from "../../data/contract/protocol"
import {devTokenBalanceQuery, useFindStakedByUserFarmQueryFarm4} from "../../data/contract/migrate"
import {useRecoilValue} from "recoil";

enum Key {
  value = "value",
}

interface Props {
  type: Type
  token: string
  lpToken: string
  tab?: Tab
  /** Gov stake */
  gov?: boolean
  farmResponseFun?: (
    res: TxResult | undefined,
    errors: PostError | undefined,
    type?: string
  ) => void
  partial?: boolean
  pageName?: FarmType
  isOpen?: boolean
  farmContractType: FarmContractTYpe
}

/**
 * @Instructions-for-unstake
 *
 * @step1: send query with lpToken, you will get a tempToken
 * @step2: send another query for staked balance(max) with temp-token
 * @step3: send balance and temp-token in contract for unstake
 * @note: show staked value to user but send devToken value in contract
 */

const FarmStakeForm = ({
  type,
  token,
  tab,
  gov,
  farmResponseFun,
  partial,
  lpToken: outerLpToken,
                         farmContractType,
  pageName,
                         isOpen
}: Props) => {
  const farmPage = useFarmPage(pageName)

  /* context */
  const { contracts, whitelist } = useProtocol()
  const { getSymbol } = useTokenMethods()

  // const findUserStakedTimeFn = useRecoilValue(findUserStakedTime)
  const findUserStakedTimeFn = useFindUsersStakedTime()
  const findUserStakedTimeFarm2Fn = useFindUsersStakedTimeFarm2(farmContractType)
  const findTokenDetailFn = useFindTokenDetails()

  const { lpToken } = whitelist[token] ?? {}

  const [agree, setAgree] = useState(false)

  // const findDevTokenFn = useRecoilValue(findDevTokensByLp)
  const findDevTokenFn = useFindDevTokensByLp()
  const FindDevTokensByLpFarm2 = useFindDevTokensByLpFarm2(farmContractType)
  const devToken = findDevTokenFn?.(lpToken ?? outerLpToken ?? "")
  const devTokenFarm2 = FindDevTokensByLpFarm2?.(lpToken ?? outerLpToken ?? "")

  const balanceQuery = useRecoilValue(devTokenBalanceQuery({ devToken : devToken ?? ""}))
  const balanceFarm2Query = useRecoilValue(devTokenBalanceQuery({ devToken : devTokenFarm2 ?? ""}))

  const { contents: findBalances } = useLpTokenBalancesV2Query()
  const findFarmLPBalance = (token: string) => findBalances[token]

  const balance = balanceQuery?.balance ?? "0"
  const balanceFarm2 = farmContractType === FarmContractTYpe.Farm4 ? findFarmLPBalance?.(token) ?? "0" : balanceFarm2Query?.balance ?? "0"

  const findStakedByUserFarm = useFindStakedByUserFarmQuery()
  const findStakedByUserFarm2 = useFindStakedByUserFarmQueryFarm2(farmContractType)
  const findStakedByUserFarm4Fn = useFindStakedByUserFarmQueryFarm4()
  const lpStaked = findStakedByUserFarm(lpToken ?? outerLpToken ?? "")
  const lpStakedv2 = farmContractType === FarmContractTYpe.Farm4 ? findStakedByUserFarm4Fn(lpToken ?? outerLpToken ?? "") ?? "0" : findStakedByUserFarm2(lpToken ?? outerLpToken ?? "") ?? "0"

  const { timeLeft, timeString, formatTime } = useUnstakedTimeout(
    findUserStakedTimeFn?.(lpToken ?? outerLpToken ?? "")
  )

  const { timeLeft: timeLeftv2, timeString: timeStringv2, formatTime: formatTimev2 } = useUnstakeTimoutFarm2(
      findUserStakedTimeFarm2Fn?.(lpToken ?? outerLpToken ?? ""), farmContractType, lpToken ?? outerLpToken ?? ""
  )

  /* get lp balance */
  const { contents: lpTokenBalances } = useLpTokenBalancesQuery()
  const token1Value = farmContractType === FarmContractTYpe.Farm4 ? findFarmLPBalance(lpToken ?? outerLpToken ?? "") ?? "0" : lpTokenBalances[outerLpToken ?? lpToken] ?? "0"

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol(token)
    return {
      [Key.value]: {
        [Type.STAKE]: v.amount(value, {
          symbol,
          max: div(token1Value, SMALLEST) ?? "0",
          min: "0",
        }),
        [Type.UNSTAKE]: v.required(value),
      }[type],
    }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)
  const pairSymbol = findTokenDetailFn?.(lpToken ?? outerLpToken, "lp")

  /* render:form */
  const max =
    outerLpToken !== undefined && type === Type.STAKE
      ? div(token1Value, SMALLEST) ?? "0"
      : "1"

  const fields = getFields({
    [Key.value]: {
      [Type.STAKE]: {
        label: "Amount",
        input: {
          type: "number",
          step: step(symbol),
          placeholder: placeholder(symbol),
          autoFocus: true,
          setValue: form.setValue,
          name: Key.value,
          decimal: 3,
        },
        help: {
          [Type.STAKE]: renderBalance(max, symbol),
          [Type.UNSTAKE]: renderBalance(div(farmPage === FarmType.farm ? balance : balanceFarm2, SMALLEST), symbol),
        }[type],
        unit: pairSymbol ? `${pairSymbol.tokenSymbol} ${LP}` : LP,
        max: gt(max, 0)
          ? () => setValue(Key.value, lookup(max, symbol))
            : undefined,
        maxValue: gt(max, 0)
            ? () => lookup(max, symbol)
            : undefined,
      },
      [Type.UNSTAKE]: {
        max: gt(max, 0)
          ? () => setValue(Key.value, lookup(div(farmPage === FarmType.farm ? balance : balanceFarm2, SMALLEST), symbol))
          : undefined,
        maxValue: gt(max, 0)
            ? () => lookup(div(farmPage === FarmType.farm ? balance : balanceFarm2, SMALLEST), symbol)
            : undefined,
      },
    }[type],
  })

  useEffect(() => {
    if (type === Type.UNSTAKE) {
      setValue(Key.value, decimal(div(farmPage === FarmType.farm ? balance : balanceFarm2, SMALLEST), 3))
    }
  }, [type, lpToken, balance, balanceFarm2, isOpen])

  const contents = undefined

  /* submit */
  const newContractMsg = useNewContractMsg()
  const unstakeData = type === Type.UNSTAKE ? gt(number(farmPage === FarmType.farm ? timeLeft : timeLeftv2), "0") ? { unstake_without_claim: {
    pool_address: lpToken ?? outerLpToken ?? ""
}} : { unstake_and_claim: {
    pool_address: lpToken ?? outerLpToken ?? ""
  }} : {}

  const data = {
    [Type.STAKE]: [
      newContractMsg(lpToken ?? outerLpToken ?? "", {
        send: {
          contract: farmPage === FarmType.farm ? contracts["loop_farm_staking"] : contracts[farmContractType],
          amount,
          msg: "eyJzdGFrZSI6e319", //{stake:{}}
        },
      }),
    ],
    [Type.UNSTAKE]: ((farmPage === FarmType.farm && devToken) || (farmPage === FarmType.farm2 && devTokenFarm2) || (farmPage === FarmType.farm3 && (lpToken ?? outerLpToken ?? "")))
      ? [
          farmPage === FarmType.farm3  ? newContractMsg(contracts[farmContractType] ?? "", unstakeData) : newContractMsg(farmPage === FarmType.farm ? devToken : devTokenFarm2, {
            send: {
              contract: farmPage === FarmType.farm ? contracts["loop_farm_staking"] : contracts[farmContractType],
              amount: farmPage === FarmType.farm ? balance : balanceFarm2,
              msg: "eyJ1bnN0YWtlX2FuZF9jbGFpbSI6e319", //{unstake_and_claim:{}}
            },
          })
        ]
      : [],
  }[type as Type]

  const messages = undefined

  const   disabled =
    invalid ||
    (type === Type.STAKE && !gt(token1Value, "0")) ||
    (type === Type.UNSTAKE && farmPage != FarmType.farm3 && !gt(farmPage === FarmType.farm ? balance : balanceFarm2, "0")) ||
    (type === Type.UNSTAKE && gt(number(farmPage === FarmType.farm ? timeLeft : timeLeftv2), "0") && !agree)

  /* result */
  const parseTx = useFarmStakeReceipt(type, !!gov)

  const msgInfo = {
    max: {
      [Type.STAKE]: multiple(max, SMALLEST),
      [Type.UNSTAKE]: multiple(value, SMALLEST),
    }[type],
    value: value,
    symbol: "LP",
  }

  const container = {
    label: type === Type.STAKE ? "Stake" : "Unstake",
    tab,
    attrs,
    contents,
    messages,
    disabled,
    data,
    parseTx,
    msgInfo,
    partial,
  }

  return (
    <CustomMsgFormContainer
      sm={false}
      {...container}
      farmResponseFun={farmResponseFun}
      label={type}
    >
      {type === Type.STAKE && (
        <div className={styles.msg}>
          <>
            <p>
              Min 1 week stake period before able to claim rewards but you can
              withdraw any time.
            </p>
          </>
        </div>
      )}

      {
        type === Type.STAKE && <FormGroup {...fields[Key.value]} unitClass={styles.lengthy} />
      }

      {type === Type.UNSTAKE && (
        <Confirm
          className={styles.confirm}
          list={[
            ...insertIf(type === Type.UNSTAKE, {
              title: "Amount",
              content: (
                <div className={styles.unstake_content}>
                  {decimal(div(farmPage === FarmType.farm ? lpStaked : lpStakedv2, SMALLEST), 4)}{" "}
                  <span> {pairSymbol ? pairSymbol.tokenSymbol : ""}</span> LP
                </div>
              ),
            }),
          ]}
        />
      )}

      {type === Type.UNSTAKE && ((FarmType.farm === farmPage && gt(number(timeLeft), "0")) || ([FarmType.farm2, FarmType.farm3].includes(farmPage) && gt(number(timeLeftv2), "0"))) && (
        <FormFeedback notice>
          Check this checkbox if you want to unstake without rewards.
        </FormFeedback>
      )}

      {type === Type.UNSTAKE && ((FarmType.farm === farmPage && gt(number(timeLeft), "0")) || ([FarmType.farm2, FarmType.farm3].includes(farmPage) && gt(number(timeLeftv2), "0"))) && (
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
      )}
      {
        type === Type.UNSTAKE && ( farmPage === FarmType.farm ? (
        <Grid>
          {timeLeft && timeString.length > 0 ? (
            <span className={styles.timeLeftSection}>
              {timeString && gt(number(timeLeft), "0") && (
                  <span className={styles.timeLeft}>Time Left : </span>
              )}
                          {formatTime && gt(number(timeLeft), "0") ? ` ${formatTime}` : ""}
            </span>
                    ) : (
                        <span>(Few days left)</span>
                    )}
                  </Grid>
              ) : (
                  <Grid>
                    {timeLeftv2 && timeStringv2.length > 0 ? (
                        <span className={styles.timeLeftSection}>
              {timeStringv2 && gt(number(timeLeftv2), "0") && (
                  <span className={styles.timeLeft}>Time Left : </span>
              )}
                          {formatTimev2 && gt(number(timeLeftv2), "0") ? ` ${formatTimev2}` : ""}
            </span>
            ) : (
                <span>(Few days left)</span>
            )}
          </Grid>
      )
        )}

      {type === Type.UNSTAKE && !(timeString && gt(number(timeLeft), "0")) && (
        <FormFeedback notice>
          Are you sure you want to unstake your LP and rewards?
        </FormFeedback>
      )}

      {gov && type === Type.STAKE && (
        <FormFeedback help>{Tooltip.My.GovReward}</FormFeedback>
      )}
    </CustomMsgFormContainer>
  )
}

export default FarmStakeForm
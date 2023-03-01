import useNewContractMsg from "../../terra/useNewContractMsg"
import {LOOP, SMALLEST, UST} from "../../constants"
import {div, multiple, number} from "../../libs/math"
import {isNative, lookupAmount, lookupSymbol, toAmount} from "../../libs/parse"
import useForm from "../../libs/useForm"
import {placeholder, renderBalance, step, toBase64, validate as v,} from "../../libs/formHelpers"

import FormGroup from "../../components/FormGroup"
import {Type} from "../../pages/PoolDynamic"
import {PostError} from "../FormContainer"
import {useEffect, useRef, useState} from "react"
import styles from "../../pages/LoopStake.module.scss"
import {TxResult} from "@terra-money/wallet-provider"
import {useContractsList, useFindBalance} from "../../data/contract/normalize"
import MiniFormContainer from "../MInFormContainer";
import {useRecoilValue} from "recoil";
import {depositedQuery, useTokenMethods} from "../../data/contract/info"
import {useProtocol} from "../../data/contract/protocol";
import usePoolReceipt from "../receipts/usePoolReceipt";
import useSelectSwapAsset from "../Exchange/useSelectSwapAsset";
import {AssetBalanceKey, BalanceKey, PriceKey} from "../../hooks/contractKeys";
import {TooltipIcon} from "../../components/Tooltip";
import Tooltip from "../../lang/Tooltip.json";
import usePoolDynamic from "../Pool/usePoolDynamic";
import {usePoolPairPool} from "../../data/contract/migrate";
import {useFindPair, useFindTokenDetails} from "../../data/form/select";
import {CONTRACT} from "../../hooks/useTradeAssets";
enum Key {
  token1 = "token1",
  value = "value",
  pair = "pair",
  lp = "lp",
}

interface Props {
  type: Type
  lpToken: string
  pairProp: string
  farmResponseFun?: (
    res: TxResult | undefined,
    err?: PostError | undefined
  ) => void
}

const FarmWizardStep2Form = ({
  type,
  lpToken,
  farmResponseFun,
                               pairProp,
}: Props) => {
  const priceKey = PriceKey.PAIR
  const balanceKey = {
    [Type.PROVIDE]: BalanceKey.TOKEN,
    [Type.WITHDRAW]: BalanceKey.LPSTAKABLE,
  }[type]

  /* context */
  const { getToken } = useProtocol()
  const { getSymbol } = useTokenMethods()
  const findTokenDetailFn = useFindTokenDetails()
  const findBalanceFn = useFindBalance()
  const { check8decOper } = useTokenMethods()

  const deposited:any =  depositedQuery

  const user_staked  = useRecoilValue<string | undefined>(deposited)
  const findBalance = useFindBalance()

  /* form:validate */
  const validate = ({ value, token1, lp, pair }: Values<Key>) => {
    const symbol = getSymbol('')
    return {
      [Key.token1]: v.required(token1),
      [Key.pair]: v.required(pair),
      [Key.lp]: v.required(lp),
      [Key.value]: type === Type.WITHDRAW ? v.required(div(user_staked, SMALLEST)) : v.amount(value, { symbol, max: findBalance(getToken(LOOP)) })
    }
  }

  /* form:hook */
  const initial = {
    [Key.token1]: lpToken ?? "",
    [Key.pair]:  pairProp ?? "",
    [Key.lp]: lpToken ?? "",
    [Key.value]: type === Type.WITHDRAW ? div(user_staked, SMALLEST) : "9",
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid, setValues } = form
  const { token1, value, pair, lp } = values

  const token1Detail = findTokenDetailFn(token1, "lp")
  const symbol = token1Detail ? lookupSymbol(token1Detail.tokenSymbol) : ""
  const amount = toAmount(value)

  const maxLiquidity = findBalanceFn?.(token1) ?? "0"

  const onSelect = (name: Key) => (token: string, pair: string | undefined) => {
    const pairs = { pair: pair, lp: token ?? "" }
    const next: Partial<Record<Key, Partial<Values<Key>>>> = {
      [Key.token1]: { token1: token1, ...pairs },
    }
    setValues({ ...values, ...next[name], [name]: token })
  }

  const config = {
    token: token1,
    onSelect: onSelect(Key.token1),
    symbol: symbol,
    priceKey,
    balanceKey,
    formatTokenName: undefined,
    formatPairToken: true,
    showAsPairs: true,
    balanceType: AssetBalanceKey.LP,
    showQuickTokens: false,
  }

  const select = useSelectSwapAsset({ ...config })

  const getPool = usePoolDynamic(123)
  const { contents: poolResult} = usePoolPairPool(pair ?? "")

  const pool = token1
      ? getPool({
        amount: check8decOper(lp) ? multiple(amount, 100) : amount,
        token: lp,
        token2: UST,
        pairPoolResult: poolResult,
        type,
      })
      : undefined

  const fromLP = pool?.fromLP

  const fields = {
    ...getFields({
      [Key.value]: {
        label: "Withdraw liquidity",
        input: {
          type: "number",
          step: step(symbol),
          placeholder: placeholder(symbol),
          autoFocus: true,
          disabled: true,
          setValue: setValue,
          name: Key.value,
        },
        hideInput: true,
        help: renderBalance(token1 ? div(maxLiquidity, SMALLEST) : "0", symbol),
        smScreen: true,
        unit: select.button,
        assets: select.assets,
        maxOnly: true,
        max: () => {
          setValue(Key.value, div(maxLiquidity, SMALLEST))
        },
        maxValue: () => div(maxLiquidity, SMALLEST)
      },
    }),
    estimated: {
      label: (
          <TooltipIcon content={Tooltip.Pool.Output}>Receive</TooltipIcon>
      ),
      value: fromLP?.text ?? "-",
    }
  }

  useEffect(()=>{
    lpToken && setValues({...values, [Key.value]: div(maxLiquidity ?? "0", SMALLEST), [Key.pair]: pairProp ?? "" })
  },[lp, lpToken, maxLiquidity, pairProp])

  const contents = undefined

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = {
    [Type.WITHDRAW]: (lp && pair) ? [
      newContractMsg(lp, {
        send: {
          amount,
          contract: pair ?? "",
          msg: toBase64({ withdraw_liquidity: {} }),
        },
      }),
    ] : [],
  }[type as Type]

  const messages = undefined
  const disabled = invalid

  /* result */
  const parseTx = usePoolReceipt(type)

  const container = {
    attrs,
    contents,
    messages,
    disabled,
    data,
    parseTx,
  }

  const [response, setResponse] = useState<TxResult | undefined>()

  return (
    <MiniFormContainer
      farmResponseFun={farmResponseFun}
      {...container}
      extResponse={response}
      className={styles.mimiContainer}
      // customActions={()=><></>}
        label={'WITHDRAW LP AND TX PROFIT'}
    >
      <section>
        <div className={styles.multiLinesForm}>
          <div className={styles.full_submit_input}>
            <FormGroup {...fields[Key.value]} vertical={true} multiLines={true} />
            <FormGroup {...fields["estimated"]} vertical={true} />
          </div>
          <div className={styles.full_submit}>
            {/*<button className={styles.button} disabled={disabled} >WITHDRAW LP AND TX PROFIT</button>*/}
          </div>
        </div>
      </section>
    </MiniFormContainer>
  )
}

export default FarmWizardStep2Form

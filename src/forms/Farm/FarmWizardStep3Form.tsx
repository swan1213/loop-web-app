import {useEffect, useRef, useState} from "react"
import {TxResult} from "@terra-money/wallet-provider"

import useNewContractMsg from "../../terra/useNewContractMsg"
import {LP, MIN_FEE, SMALLEST, UST, UUSD} from "../../constants"
import {div, gt, max,minus, multiple, number, plus} from "../../libs/math"
import {
  decimal,
  format,
  isNative,
  lookupAmount,
  lookupSymbol,
  toAmount
} from "../../libs/parse"
import useForm from "../../libs/useForm"
import {placeholder, renderBalance, step, toBase64, validate as v, validateSlippage,} from "../../libs/formHelpers"
import {AssetBalanceKey, BalanceKey, PriceKey} from "../../hooks/contractKeys"

import FormGroup from "../../components/FormGroup"
import {Type} from "../../pages/PoolDynamic"
import {PostError} from "../FormContainer"

import {useFindBalance} from "../../data/contract/normalize";
import {useTokenMethods} from "../../data/contract/info"
import {useFindTokenDetails} from "../../data/form/select";
import usePoolDynamic from "../Pool/usePoolDynamic";
import getLpName from "../../libs/getLpName";
import useSelectSwapAsset from "../Exchange/useSelectSwapAsset";
import BN from "bignumber.js";
import usePoolShare from "../usePoolShare";
import {TooltipIcon} from "../../components/Tooltip";
import Tooltip from "../../lang/Tooltip.json";
import Count from "../../components/Count"
import {insertIf} from "../../libs/utils"
import {percent} from "../../libs/num";
import usePoolReceipt from "../receipts/usePoolReceipt"
import useFee from "../../graphql/useFee";
import useTax from "../../graphql/useTax";
import useLocalStorage from "../../libs/useLocalStorage";
import SetManualSlippageTolerance from "../SetManualSlippageTolerance"
import Grid from "../../components/Grid"
import CustomMsgFormContainer from "../CustomMsgFormContainer"
import styles from './FarmWizardStep3Form.module.scss'
import {usePoolPairPoolList} from "../../data/contract/migrate";
import {useProtocol} from "../../data/contract/protocol";
import Result from "../Result";

enum Key {
  token1 = "token1",
  token2 = "token2",
  value = "value",
  pair = "pair",
  lp = "lp"
}

interface Props {
  type: Type
  lpToken: string
  pairProp: string
  tokens: string[] | undefined
  farmResponseFun?: (
    res: TxResult | undefined,
    err?: PostError | undefined
  ) => void
}

const FarmWizardStep3Form = ({
  type,
  lpToken,
  farmResponseFun,
                               tokens,
                               pairProp,
}: Props) => {
  const pageName = window.location.pathname
  const lpTokenProp = lpToken
  const priceKey = PriceKey.PAIR
  const balanceKey = {
    [Type.PROVIDE]: BalanceKey.TOKEN,
    [Type.WITHDRAW]: BalanceKey.LPSTAKABLE,
  }[type]

  const findBalanceFn = useFindBalance()
  const { whitelist } = useProtocol()
  const { check8decOper } = useTokenMethods()

  const [totalTax, setTotalTax] = useState("0")
  const [estimatedValue, setEstimatedValue] = useState("0")

  // usePolling()
  const [time, setTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 3000)
    return () => {
      clearInterval(interval);
    };
  }, [])

  /* form:validate */
  const validate = ({ value, token1, token2, pair, lp }: Values<Key>) => {
    const token1Detail = findTokenDetailFn(token1)
    const token2Detail = findTokenDetailFn(token2)
    const symbol1 = token1Detail ? token1Detail.tokenName : ""
    const symbol2 = token2Detail ? token2Detail.tokenName : ""

    return {
      [Key.value]: {
        [Type.PROVIDE]: v.amount(value, {
          symbol: symbol1 ?? undefined,
          min: undefined,
          max: isNative(token1)
              ? multiple(findBalanceFn(token1), SMALLEST)
              : findBalanceFn(token1),
        }),
        [Type.WITHDRAW]: v.amount(value, {
          symbol: undefined,
          min: "0",
          max: div(findBalanceFn(token1), SMALLEST),
        }, '', '6'),
      }[type],
      [Key.token1]: v.required(token1),
      [Key.token2]: type === Type.WITHDRAW ? "" : v.required(token2),
      [Key.pair]: v.required(pair),
      [Key.lp]: type === Type.WITHDRAW ? v.required(lp) : ""
    }
  }

  const findTokenDetailFn = useFindTokenDetails()

  /* form:hook */
  const initial = {
    [Key.value]: "",
    [Key.token1]: tokens ?  tokens[0] : '',
    [Key.token2]: tokens ?  tokens[1] : '',
    [Key.pair]: pairProp ?? "",
    [Key.lp]: lpToken ?? lpTokenProp ?? ""
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields, attrs, invalid, reset } = form
  const { value, token1, token2, pair, lp } = values

  useEffect(() => {
    pairProp && reset();
  }, [pairProp, lpToken, tokens])

  const amount = toAmount(value)
  const token1Detail =
      type === Type.PROVIDE
          ? findTokenDetailFn(tokens?.[0] ?? token1)
          : findTokenDetailFn(token1, 'lp')
  const token2Detail = findTokenDetailFn(tokens?.[1] ?? token2)
  const symbol1 = token1Detail ? lookupSymbol(token1Detail.tokenSymbol) : ""
  const symbol2 = token2Detail ? lookupSymbol(token2Detail.tokenSymbol) : ""
  const [shouldClose, setShouldClose] = useState(false)

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>()
  const onSelect = (name: Key) => (token: string, pair: string | undefined) => {
    const pairs =
        name === Key.token2 && type === Type.PROVIDE
            ? { pair: pair ?? "" }
            : { pair: pair, lp: token ?? "" }
    const next: Partial<Record<Key, Partial<Values<Key>>>> = {
      [Key.token1]: { token2: name === Key.token1 ? "" : token2, ...pairs },
      [Key.token2]: { token1: token1, ...pairs },
    }
    const resetValue = type === Type.PROVIDE ? { [Key.value]: "0" } : {}
    setValues({ ...values, ...next[name], [name]: token, ...resetValue })
    setShouldClose(name === Key.token1)
  }

  const { contents: poolPairPoolList} = usePoolPairPoolList()
  const poolResult: any = poolPairPoolList?.[pair ?? pairProp ?? ""]
  // const poolResult: any = usePoolPairPool(pair ?? pairProp ?? "")
  // const poolResult: any = useRecoilValue(poolUsePairPoolRowQuery({pair: pair ?? ""}))

  const maxLiquidity = findBalanceFn?.(token1) ?? "0"
  const getPool = usePoolDynamic(time)

  /* render:form */
  const config = {
    token: token1,
    onSelect: onSelect(Key.token1),
    symbol: symbol1,
    priceKey,
    balanceKey,
    formatTokenName: undefined,
    formatPairToken: type === Type.WITHDRAW ? true : undefined,
    showAsPairs: type === Type.WITHDRAW ? true : undefined,
    balanceType: {
      [Type.WITHDRAW]: AssetBalanceKey.LP,
      [Type.PROVIDE]: AssetBalanceKey.BALANCE,
    }[type],
    showQuickTokens: false,
    vertical: true,
    newFactory: true,
    showBalance: false
  }

  /* render:form */
  const config2 = {
    token: token2,
    symbol: symbol2,
    otherToken: config.token,
    onSelect: onSelect(Key.token2),
    priceKey,
    balanceKey,
    formatTokenName: type === Type.WITHDRAW ? getLpName : undefined,
    skip: type === Type.WITHDRAW ? undefined : ['terra15a9dr3a2a2lj5fclrw35xxg9yuxg0d908wpf2y','terra14tl83xcwqjy0ken9peu4pjjuu755lrry2uy25r','terra1aa7upykmmqqc63l924l5qfap8mrmx5rfdm0v55'],
    newFactory: true,
    showQuickTokens: false,
    showBalance: false
  }

  const select = useSelectSwapAsset({ ...config })
  const select2 = useSelectSwapAsset({
    ...config2,
    shouldClose,
  })

  const perTokenPoolValue = token1
      ? getPool({
        amount: SMALLEST.toString(),
        token: type === Type.WITHDRAW ? lp : token1,
        token2: token2 ?? UST,
        pairPoolResult: poolResult,
        type,
      })
      : undefined

  const pool = token1
      ? getPool({
        amount: check8decOper(type === Type.WITHDRAW ? lp : token1) ? multiple(amount, 100) : amount,
        token:
            type === Type.WITHDRAW
                ? lp
                : token1,
        token2: token2 ?? UST,
        pairPoolResult: poolResult,
        type,
      })
      : undefined

  const toLP = pool?.toLP

  const fromLP = pool?.fromLP
  const estimated = div(pool?.toLP.estimated, SMALLEST)

  const uusd = {
    [Type.PROVIDE]: pool?.toLP.estimated ?? "0",
    [Type.WITHDRAW]: fromLP?.uusd.amount,
  }[type]

  const secondTokenMaxValue = shouldClose
      ? "0"
      : token2
          ? lookupAmount(findBalanceFn(token2), isNative(token2) ? 0 : token2Detail?.decimals)
          : ""

  const firstTokenMaxValue = {
    [Type.WITHDRAW]: div(maxLiquidity, SMALLEST),
    [Type.PROVIDE]: isNative(token1)
        ? lookupAmount(findBalanceFn(token1), 0)
        : lookupAmount(findBalanceFn(token1), token1Detail?.decimals)
  }[type]


  const total = firstTokenMaxValue ?? "0" //get lp token balance

  const lpAfterTx = {
    [Type.PROVIDE]: plus(total, toLP?.value),
    [Type.WITHDRAW]: max([minus(maxLiquidity, amount), "0"]),
  }[type]

  /* share of pool */
  const modifyTotal = {
    [Type.PROVIDE]: (total: string) => plus(total, toLP?.value),
    [Type.WITHDRAW]: (totalSuppl: string) =>
        new BN(totalSuppl).minus(div(amount, SMALLEST)).toString(),
  }[type]

  const getPoolShare = usePoolShare(modifyTotal)
  const poolShareData = {
    amount: div(lpAfterTx, SMALLEST),
    token: token1,
    total: div(poolResult?.total_share ?? "0", SMALLEST),
  }

  const poolShare = getPoolShare(poolShareData)

  const { ratio, lessThanMinimum, minimum } = poolShare

  const delisted = whitelist[token1]?.["status"] === "DELISTED"


  useEffect(() => {
    const secondTokenMax = secondTokenMaxValue

    if (gt(div(toLP?.estimated ?? "0", SMALLEST), secondTokenMax)) {
      const adjustedValue = minus(
          div(secondTokenMax, div(perTokenPoolValue?.toLP.estimated, SMALLEST)),
          MIN_FEE
      )

      const calculatedVal = decimal(
          gt(adjustedValue, 0) ? adjustedValue : "0",
          4
      )

      const valid =
          !gt(adjustedValue, firstTokenMaxValue) &&
          type === Type.PROVIDE &&
          token2

      valid &&
      setValue(
          Key.value,
          isNative(token1) ? decimal(calculatedVal, 3) : calculatedVal
      )
    }
    setEstimatedValue(shouldClose ? "0" : div(toLP?.estimated, SMALLEST) ?? "0")
  }, [toLP?.estimated])

  const fields = {
    ...getFields({
      [Key.value]: {
        label: {
          [Type.PROVIDE]: (
              <TooltipIcon content={Tooltip.Pool.InputAsset}>Asset 1</TooltipIcon>
          ),
          [Type.WITHDRAW]: (
              <TooltipIcon content={Tooltip.Pool.LP}>LP</TooltipIcon>
          ),
        }[type],
        input: {
          type: "number",
          step: step(symbol1),
          placeholder: placeholder(symbol1),
          autoFocus: true,
          ref: valueRef,
          setValue: form.setValue,
          name: Key.value,
          decimal: type === Type.PROVIDE ? 4 : 6
        },
        unit: delisted ? symbol1 : select.button,
        max: {
          [Type.PROVIDE]: gt(findBalanceFn(token1) ?? "0", "0")
              ? () => {
                // if token 1 is UST deduct fee+tax first
                const deductTax = [UST,'UUSD'].includes(symbol1.toUpperCase())

                const num = minus(
                    firstTokenMaxValue,
                    deductTax ? totalTax : "0"
                )
                const maxInput = gt(num, 0)
                    ? isNative(token1)
                        ? decimal(num, 5)
                        : num
                    : "0"
                const maxValue = deductTax
                    ? gt(maxInput, "100")
                        ? minus(maxInput, 10)
                        : minus(maxInput, 0.5)
                    : maxInput

                setValue(
                    Key.value,
                    maxValue
                )
              }
              : undefined,
          [Type.WITHDRAW]: gt(maxLiquidity?.toString(), 0)
              ? () => {
                const num = div(maxLiquidity, SMALLEST)
                setValue(Key.value, gt(num, 0) ? num : "0")
              }
              : undefined,
        }[type],
        maxValue: {
          [Type.PROVIDE]: gt(findBalanceFn(token1) ?? "0", "0")
              ? () => {
                // if token 1 is UST deduct fee+tax first
                const deductTax = symbol1.toUpperCase() === 'UST'

                const num = minus(
                    firstTokenMaxValue,
                    deductTax ? totalTax : "0"
                )
                const maxInput = gt(num, 0)
                    ? isNative(token1)
                        ? decimal(num, 5)
                        : num
                    : "0"
                const maxValue = deductTax
                    ? gt(maxInput, "100")
                        ? minus(maxInput, 10)
                        : minus(maxInput, 0.5)
                    : maxInput
                return maxValue
              }
              : undefined,
          [Type.WITHDRAW]: gt(maxLiquidity, 0)
              ? () => {
                const num = div(maxLiquidity, SMALLEST)
                return gt(num, 0) ? num  : "0"
              }
              : undefined,
        }[type],
        assets: select.assets,
        help: {
          [Type.PROVIDE]: renderBalance(
              token1
                  ? isNative(token1)
                      ? lookupAmount(findBalanceFn(token1), 0)
                      : lookupAmount(findBalanceFn(token1), token1Detail?.decimals)
                  : ""
          ),
          [Type.WITHDRAW]: renderBalance(
              token1
                  ? maxLiquidity
                  : "0",
              symbol1
          ),
          [Type.WITHDRAW]: renderBalance(token1 ? maxLiquidity : "0", symbol1),
        }[type],
        focused: type === Type.WITHDRAW && select.isOpen,
      },
    }),

    estimated: {
      [Type.PROVIDE]: {
        label: "Asset 2",
        value: shouldClose ? "-" : div(div(toLP?.estimated, check8decOper(token2) ? "100" : "1"), SMALLEST) ?? "",
        unit: select2.button,
        assets: select2.assets,
        help: renderBalance(
            token2
                ? isNative(token2)
                    ? lookupAmount(findBalanceFn(token2), 0)
                    : lookupAmount(findBalanceFn(token2), token2Detail?.decimals)
                : ""
        ),
        focused: select2.isOpen,
        max: token2 && token2.length > 0 ? () =>  "0" : undefined,
        maxValue:  token2  && token2.length > 0 ? () => "0" : undefined
      },
      [Type.WITHDRAW]: {
        label: (
            <TooltipIcon content={Tooltip.Pool.Output}>Receive</TooltipIcon>
        ),
        value: fromLP?.text ?? "-",
      },
    }[type],
  }

  /* confirm */
  const prefix = lessThanMinimum ? "<" : ""
  const contents = !gt(
      type === Type.WITHDRAW
          ? toLP?.estimated ?? "0"
          : div(toLP?.estimated, SMALLEST) ?? "0",
      0
  )
      ? undefined
      : [
        {
          title: (
              <TooltipIcon
                  content={
                    type == Type.PROVIDE
                        ? `${symbol1 ? symbol1 : ""}-${symbol2 ? symbol2 : ""} Price`
                        : "Price"
                  }
              >
                {type === Type.PROVIDE
                    ? `${symbol1 ? symbol1 : ""}-${symbol2 ? symbol2 : ""} Price`
                    : "Price"}
              </TooltipIcon>
          ),
          content: (
              <Count format={format} symbol={""}>
                {toLP?.estimatedSingle ?? "0"}
              </Count>
          ),
        },
        ...insertIf(type === Type.PROVIDE, {
          title: (
              <TooltipIcon content={Tooltip.Pool.LPfromTx}>
                LP from Tx
              </TooltipIcon>
          ),
          content: <Count symbol={LP}>{toLP?.value}</Count>,
        }),
        ...insertIf(pageName != '/farm-wizard' && (type === Type.WITHDRAW || gt(lpAfterTx, 0)), {
          title: "LP after Tx",
          content: <Count symbol={LP}>{lpAfterTx}</Count>,
        }),
        {
          title: (
              <TooltipIcon content={Tooltip.Pool.PoolShare}>
                Pool Share after Tx
              </TooltipIcon>
          ),
          content: (
              <Count format={(value) => `${prefix}${percent(value)}`}>
                {lessThanMinimum ? minimum : ratio}
              </Count>
          ),
        },
      ]

  const tokenNative = isNative(token1)
      ? { native_token: { denom: token1 } }
      : { token: { contract_addr: token1 } }

  const token2Native = isNative(token2)
      ? { native_token: { denom: token2 } }
      : { token: { contract_addr: token2 } }

  const provide_liquidityForContract = {
    assets: [
      { amount: check8decOper(type === Type.WITHDRAW ? lp : token1) ? multiple(amount, 100) : amount, info: { ...tokenNative } },
      {
        amount: multiple(check8decOper(token2) ? div(estimated, 100) : estimated ?? "", SMALLEST),
        info: { ...token2Native },
      },
    ],
  }

  const insertToken1Coins: any = isNative(token1) && {
    amount: amount,
    denom: token1 ?? UUSD,
  }

  const insertToken2Coins: any = isNative(token2) && {
    amount: multiple(estimated ?? "0", SMALLEST),
    denom: token2 ?? UUSD,
  }

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = !estimated
      ? []
      : {
        [Type.PROVIDE]: [
          ...insertIf(
              !isNative(token1),
              newContractMsg(token1, {
                increase_allowance: { amount: check8decOper(type === Type.WITHDRAW ? lp : token1) ? multiple(amount, 100) : amount, spender: pair },
              })
          ),
          ...insertIf(
              !isNative(token2) && estimated,
              newContractMsg(token2, {
                increase_allowance: {
                  amount: multiple(check8decOper(token2) ? div(estimated, 100) : estimated ?? "0", SMALLEST),
                  spender: pair,
                },
              })
          ),
          newContractMsg(
              pair,
              {
                provide_liquidity: provide_liquidityForContract,
              },
              isNative(token1) && insertToken1Coins,
              isNative(token2) && insertToken2Coins
          ),
        ],
        [Type.WITHDRAW]: [
          newContractMsg(lp, {
            send: {
              amount,
              contract: pair ?? "",
              msg: toBase64({ withdraw_liquidity: {} }),
            },
          }),
        ],
      }[type]

  /* result */
  const parseTx = usePoolReceipt(type)
  const msgInfo = {
    max: token1
        ? isNative(token1)
            ? multiple(findBalanceFn(token1), SMALLEST)
            : findBalanceFn(token1)
        : "0",
    value: value,
    symbol: token1,
  }

  const disabled =
      invalid ||
      /* (limitMsgs && limitMsgs.some((limit) => limit)) ||*/
      (type === Type.WITHDRAW && !gt(toLP?.estimated ?? "0", 0))

  const tax = { pretax: uusd, deduct: type === Type.WITHDRAW }

  /* tax */
  const fee = useFee(data?.length)
  const { calcTax } = useTax()
  const calculateTax = tax.pretax ? calcTax(tax.pretax) : "0"

  useEffect(() => {
    setTotalTax(plus(div(calculateTax, SMALLEST), div(fee.amount, SMALLEST)))
  }, [calculateTax])
  const container = {
    attrs,
    contents,
    disabled,
    data,
    parseTx,
    msgInfo,
    ...tax,
  }
  const slippageState = useLocalStorage("slippage", "5")
  const [slippageValue] = slippageState
  const slippageError = validateSlippage(slippageValue)

  const slippageContent = (
      <SetManualSlippageTolerance state={slippageState} error={slippageError} />
  )

  const name = {
    [Type.PROVIDE]: {
      name: "Add Liquidity",
      className: styles.header,
    },
    [Type.WITHDRAW]:  {
      name: "Withdraw Liquidity",
      className: '',
    },
  }[type]

 /* const [response, setResponse] = useState<TxResult | undefined>(undefined)
  const [error, setError] = useState<PostError>()

  const responseFun = (
      response: TxResult | undefined,
      errorResponse?: PostError
  ) => (response ? setResponse(response) : setError(errorResponse))*/

  return (
      <Grid>
        <CustomMsgFormContainer
              {...container}
              {...tax}
              tab={undefined}
              title={name}
              slippage={slippageContent}
              responseFun={farmResponseFun}
              label={'POOL'}
          >
            <div className={styles.NewpoolLiquidityLeft}>
              <div className={styles.NewpoolLiquidityLSET}>
                <FormGroup vertical={true} {...fields[Key.value]} />
              </div>
              <div className={styles.NewpoolLiquidityCenter}>
                <button type={'button'} />
              </div>
              <div className={styles.NewpoolLiquidityLSET}>
                <FormGroup vertical={true} {...fields["estimated"]} />
              </div>
            </div>
          </CustomMsgFormContainer>

      </Grid>
  )
}

export default FarmWizardStep3Form

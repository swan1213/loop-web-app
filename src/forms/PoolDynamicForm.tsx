import {useEffect, useRef, useState} from "react"
import {TxResult} from "@terra-money/wallet-provider"
import BN from "bignumber.js"

import useNewContractMsg from "../terra/useNewContractMsg"
import Tooltip from "../lang/Tooltip.json"
import {LP, MIN_FEE, SMALLEST, UST, UUSD} from "../constants"
import {div, gt, max, minus, multiple, number, plus} from "../libs/math"
import {insertIf} from "../libs/utils"
import {adjustAmount, decimal, format, isNative, lookupAmount, lookupSymbol, relDiff, toAmount,} from "../libs/parse"
import {percent} from "../libs/num"
import useForm from "../libs/useForm"
import {placeholder, renderBalance, step, toBase64, validate as v, validateSlippage,} from "../libs/formHelpers"
import getLpName from "../libs/getLpName"
import {AssetBalanceKey, BalanceKey, PriceKey} from "../hooks/contractKeys"
import Grid from "../components/Grid"
import FormGroup from "../components/FormGroup"
import Count from "../components/Count"
import {TooltipIcon} from "../components/Tooltip"
import {Type} from "../pages/PoolDynamic"
import usePoolReceipt from "./receipts/usePoolReceipt"
import usePoolShare from "./usePoolShare"
import useSelectSwapAsset from "./Exchange/useSelectSwapAsset"
import usePoolDynamic from "./Pool/usePoolDynamic"
import CustomMsgFormContainer, {PostError} from "./CustomMsgFormContainer"
import SetManualSlippageTolerance from "./SetManualSlippageTolerance"
import useLocalStorage from "../libs/useLocalStorage"
import PoolWithPoolList from "../containers/PoolWithPoolList"
import useFee from "../graphql/useFee"
import useTax from "../graphql/useTax"
import {useFindTokenDetails} from "../data/form/select"
import {useFindBalance} from "../data/contract/normalize"
import {useFindPairPoolPrice, useTokenMethods} from "../data/contract/info"
import PoolConfirmModal from "../components/PoolConfirmModal"
import Modal from "../components/Modal"
import {useProtocol} from "../data/contract/protocol"
import {usePoolPairPool} from "../data/contract/migrate"

export enum Key {
  token1 = "token1",
  token2 = "token2",
  value = "value",
  pair = "pair",
  lp = "lp"
}
interface Prop {
  type: Type
  tab: Tab
  token1Prop?: string
  token2Prop?: string
  lpTokenProp?: string
  pairProp?: string
  responseFun?: (
    res: TxResult | undefined,
    errorRes?: PostError | undefined
  ) => void
}

export const diff  = "2"

const PoolDynamicForm = ({
  type,
  tab,
  token1Prop,
  token2Prop,
  lpTokenProp,
  pairProp,
  responseFun,
}: Prop) => {
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
      estimated:
        type === Type.PROVIDE
          ? v.amount(
            isNative(token2) ? decimal(estimatedValue, 6) : estimatedValue,
            {
              symbol: symbol2,
              min: undefined,
              max: isNative(token2)
                ? multiple(findBalanceFn(token2), SMALLEST)
                : findBalanceFn(token2),
            }
          )
          : "",
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
    [Key.token1]: type === Type.WITHDRAW ? lpTokenProp ?? "" : token1Prop ?? "",
    [Key.token2]: token2Prop ?? "",
    [Key.pair]: pairProp ?? "",
    [Key.lp]: type === Type.WITHDRAW ? (lpTokenProp ?? "") : ""
  }

  const form = useForm<Key>(initial, validate)
  const { values, setValue, setValues, getFields, attrs, invalid, reset } = form
  const { value, token1, token2, pair, lp } = values

  useEffect(() => {
    pairProp && reset();
  }, [pairProp, lpTokenProp])

  const amount = toAmount(value)
  const token1Detail =
    type === Type.PROVIDE
      ? findTokenDetailFn(token1)
      : findTokenDetailFn(token1, "lp")
  const token2Detail = findTokenDetailFn(token2)
  const symbol1 = token1Detail ? lookupSymbol(token1Detail.tokenSymbol) : ""
  const symbol2 = token2Detail ? lookupSymbol(token2Detail.tokenSymbol) : ""
  const [shouldClose, setShouldClose] = useState(false)

  useEffect(() => {
    pairProp && reset()
  }, [lpTokenProp, pairProp])

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

  const { contents: poolResult} = usePoolPairPool(pair ?? "")

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
    showQuickTokens: type === Type.PROVIDE
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
    // type: type === Type.PROVIDE ? SelectType.POOL : undefined
  }

  /*function truncateToDecimals(num: number, dec = 3) {
    const calcDec = Math.pow(10, dec)
    return Math.trunc(num * calcDec) / calcDec
  }*/
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
        // lte(calculatedVal, secondTokenMax) && // if calculated value is less than or equal to second token's max value
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
      ...insertIf(type === Type.WITHDRAW || gt(lpAfterTx, 0), {
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

  // @todo uncomment for TVL
  /*const getAmountOfPool = (token: string) => {
    if (isNative(token)) {
      return (
        poolResult &&
        poolResult.assets.find(
          (li: {
            amount: string
            info: {
              native_token?: { denom: string }
              token?: { contract_addr: string }
            }
          }) => li.info !== undefined && li.info.native_token?.denom === token
        )
      )
    } else {
      return (
        poolResult &&
        poolResult.assets.find(
          (li: {
            amount: string
            info: {
              native_token?: { denom: string }
              token?: { contract_addr: string }
            }
          }) => li.info !== undefined && li.info.token?.contract_addr === token
        )
      )
    }
  }*/

  // const { limits } = useLpLimit(myPair ?? "0")

  /*const getPoolLimit = (token: string) => {
    if (isNative(token)) {
      return (
        limits &&
        limits.find(
          (li: {
            amount: string
            info: {
              native_token?: { denom: string }
              token?: { contract_addr: string }
            }
          }) => li.info !== undefined && li.info.native_token?.denom === token
        )
      )
    } else {
      return (
        limits &&
        limits.find(
          (li: {
            amount: string
            info: {
              native_token?: { denom: string }
              token?: { contract_addr: string }
            }
          }) => li.info !== undefined && li.info.token?.contract_addr === token
        )
      )
    }
  }*/

  /* const token1TotalAmount = sum([getAmountOfPool(token1)?.amount, value])
  const token2TotalAmount = sum([
    getAmountOfPool(ifToken1Native ? ifToken1Native.denom : token2)?.amount,
    toLP?.text ?? "0",
  ])

  const getTokenInfo = (token: string) => {
    if (isNative(token)) {
      return lookupSymbol(token)
    } else {
      return getTokenSymbol(token)
    }
  }*/

  /*const limitMsgs = [
    token1TotalAmount &&
      gt(token1TotalAmount, token1 ? getPoolLimit(token1)?.amount : "0") &&
      getTokenInfo(token1 ?? ""),
    token2TotalAmount &&
      gt(
        token2TotalAmount,
        token2
          ? getPoolLimit(ifToken1Native ? ifToken1Native.denom : token2)?.amount
          : "0"
      ) &&
      getTokenInfo((ifToken1Native ? ifToken1Native.denom : token2) ?? ""),
  ]*/

  /*const afterSubmitChilds = limitMsgs && type === Type.PROVIDE && (
    <>
      {limitMsgs.map(
        (limit) =>
          limit && <FormFeedback>{limit} token limit exceed!</FormFeedback>
      )}
      {gt(toLP?.estimated ?? "0", secondTokenMaxValue) && (
        <FormFeedback>
          please reduce the{" "}
          {token2Native
            ? lookupSymbol(token2Native?.native_token?.denom)
            : getSymbol(token2)
            ? getSymbolFromContract(token2)?.tokenSymbol
            : "Second Token"}{" "}
          amount
        </FormFeedback>
      )}
    </>
  )*/

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
    tab,
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

  const findPairPoolFn = useFindPairPoolPrice()
  const priceT1 = ['uusd',UST].includes(token1) ? "1" : adjustAmount(
      check8decOper(token1),
      !check8decOper(token1),
      findPairPoolFn?.(pair, token1) ?? "0"
  )
  const priceT2 = ['uusd',UST].includes(token2) ? "1" : adjustAmount(
      check8decOper(token2),
      !check8decOper(token2),
      findPairPoolFn?.(pair, token2) ?? "0"
  )

  const newNum2 = div(div(toLP?.estimated, SMALLEST),check8decOper(token2) ? "100" : "1")
  const [difference, setDifference] = useState("0")

  useEffect(() => {
    setDifference(relDiff(decimal(div(multiple(check8decOper(token1) ? multiple(amount, 100) : amount, priceT1), SMALLEST), 1), decimal(div(multiple(multiple(newNum2, SMALLEST), priceT2), SMALLEST), 1)))
  },[toLP, amount, newNum2, priceT1, priceT2])

  const name = {
    [Type.PROVIDE]: {
      name: "Add Liquidity"
    },
    [Type.WITHDRAW]: {
      name: "Withdraw Liquidity"
    },
  }[type]

  const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
  const toggleConfirmModal = () => setIsConfirmModalOpened(!isConfirmModalOpened)

  return (
    <Grid>
      <PoolWithPoolList>
        <CustomMsgFormContainer
          {...container}
          {...tax}
          tab={undefined}
          title={name}
          // afterSubmitChilds={(gt(difference, diff) && type === Type.PROVIDE) && <Button size={'lg'} type={'button'} className={styles.submitBtn} onClick={toggleConfirmModal}>continue</Button>}
          slippage={slippageContent}
          responseFun={responseFun}
          // showSubmitBtn={(!gt(difference, diff) || type === Type.WITHDRAW)}
        >
          <FormGroup showBalance={true} {...fields[Key.value]} />
          <br />

          <br />
          <br />
          <FormGroup {...fields["estimated"]} />

          <Modal isOpen={isConfirmModalOpened}
                 title="Loop Cares About You"
                 onClose={toggleConfirmModal} >
            <PoolConfirmModal
                isOpen={isConfirmModalOpened}
                toLP={toLP}
                amount={amount}
                token1={token1}
                token2={token2}
                pair={pair}
                symbol1={symbol1}
                symbol2={symbol2}
                newNum2={newNum2}
                difference={difference}
            />
          </Modal>
        </CustomMsgFormContainer>
      </PoolWithPoolList>
    </Grid>
  )
}

export default PoolDynamicForm

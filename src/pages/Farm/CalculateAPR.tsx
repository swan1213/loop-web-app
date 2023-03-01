import {DistributableTokensByPool} from "../../data/farming/stakeUnstake"
import {useRecoilValue} from "recoil"
import {findDistributedRewardsInPool} from "../../data/contract/farming"
import {memo, useEffect, useState} from "react"
import {div, gt, minus, multiple, number, plus} from "../../libs/math"
import {adjustAmount, commas, decimal, isNative, niceNumber,} from "../../libs/parse"
import {useFindPairPoolPrice, useTokenMethods} from "../../data/contract/info"
import {useFindTokenDetails} from "../../data/form/select"
import {SMALLEST} from "../../constants"
import BigNumber from "bignumber.js"
import {FarmContractTYpe, findDistributedRewardsInPoolFarm2} from "../../data/farming/FarmV2"
import {bound} from "../../components/Boundary"
import {useProtocol} from "../../data/contract/protocol"

export function CalculateAPRFarm2({
  symbol,
  tvl,
  lpToken,
  all_rewards,
  totalPricesArray,
  sevenDaysFee,
  totalLocked,
                                    farmContractType
}: {
  symbol?: string
  tvl: string
  lpToken: string
  all_rewards: DistributableTokensByPool[] | undefined
  totalPricesArray: string[]
  sevenDaysFee?: string
  totalLocked?: string
  farmContractType: FarmContractTYpe | undefined
}) {
  const price  = useCalculatePriceFarm2({all_rewards, lpToken, type: farmContractType})
  // const price33 = useRecoilValue(farmRewards({ type: farmContractType ?? FarmContractTYpe.Farm2, lpToken}))
  // console.log("farmRewardsLP", useRecoilValue(farmRewardsLP(farmContractType ?? FarmContractTYpe.Farm2)), {price33, lpToken})
  const [allTVL, setAllTVL] = useState<string>("0")
  useEffect(()=>{
    setAllTVL(decimal(plus(price, tvl), 2))
  }, [price, tvl])

  const [APY, setAPY] = useState<string>("0")
  useEffect(()=>{
    setAPY(calculateAPR2({totalPricesArray, tvl: allTVL, sevenDaysFee, totalLocked, lpToken, }))
  }, [allTVL, totalPricesArray, sevenDaysFee, totalLocked])

  return (
    <>
      { bound(gt(APY, "0") ? (
          (!isFinite(number(APY)) || isNaN(number(APY))) ? (
              "0%"
          ) : (
              <span>
            {gt(APY, "50000")
                ? "50,000+ "
                : commas(
                    decimal(
                        isFinite(number(niceNumber(APY))) ? niceNumber(symbol == 'LunaX - LUNA' ? plus(11.6,APY) :  APY) : "0",
                        2
                    )
                )}
                %
          </span>
          )
      ) : (
          <small>Coming Soon...</small>
      ), <small>Coming Soon...</small>)}
    </>
  )
}
export const MemoizedCalculateAPRFarm2 = memo(CalculateAPRFarm2)

export const useCalculatePrice = (all_rewards, lpToken) => {
  const [list, setList] = useState<any>(undefined)
  const [price, setPrice] = useState<string | undefined>("0")
  const findDistributedRewards = useRecoilValue(findDistributedRewardsInPool)
  const { check8decOper } = useTokenMethods()

  const { getUstPair } = useProtocol()
  const findPairPoolPriceFn = useFindPairPoolPrice()

  async function fun() {
    const data =
      all_rewards && (await findDistributedRewards(all_rewards, lpToken, "all"))
    data && setList(data)
  }

  useEffect(() => {
    fun()
  }, [all_rewards, lpToken])

  useEffect(() => {
    const li =
      list &&
      Object.keys(list).map((item) => {
        const token1UstPair = getUstPair(item)
        const token1Price =
          isNative(item) && item === "uusd"
            ? "1"
            : findPairPoolPriceFn?.(token1UstPair ?? "", item) ?? "0"

        const reward = check8decOper(item)
          ? adjustAmount(true, true, div(list[item], SMALLEST))
          : div(list[item], SMALLEST)
        return multiple(reward, token1Price)
      })

    li && li.length > 0 && setPrice(li ? li.reduce((a, b) => plus(a, b)) : "0")
  }, [list])
  return price
}

export const useCalculatePriceFarm2 = ({all_rewards, lpToken, type}: {all_rewards: any | undefined, lpToken: string, type: FarmContractTYpe | undefined}) => {
  const [list, setList] = useState<any>(undefined)
  const [price, setPrice] = useState<string | undefined>("0")

  const findDistributedRewards = useRecoilValue(findDistributedRewardsInPoolFarm2(type ?? FarmContractTYpe.Farm2))
  const { getUstPair } = useProtocol()
  const findPairPoolPriceFn = useFindPairPoolPrice()
  const { check8decOper } = useTokenMethods()

  async function fun() {
    const data =
      all_rewards && (await findDistributedRewards(all_rewards, lpToken, "all"))
    data && setList(data)
  }

  useEffect(() => {
    list && fun()
  }, [all_rewards, lpToken, findDistributedRewards])

  useEffect(() => {
    const li =
      list &&
      Object.keys(list).map((item) => {
        const token1UstPair = getUstPair(item)
        const token1Price =
          isNative(item) && item === "uusd"
            ? "1"
            : findPairPoolPriceFn?.(token1UstPair ?? "", item) ?? "0"

        const reward = check8decOper(item)
          ? adjustAmount(true, true, div(list[item], SMALLEST))
          : div(list[item], SMALLEST)
        return multiple(reward, token1Price)
      })
    li && li.length > 0 && setPrice(li ? li.reduce((a, b) => plus(a, b)) : "0")
  }, [list])
  return price
}

export const useCalculateUserPrice = (user_rewards) => {
  const { getUstPair } = useProtocol()
  const findPairPoolPriceFn = useFindPairPoolPrice()
  const findTokenDetailFn = useFindTokenDetails()
  const { check8decOper } = useTokenMethods()

  return user_rewards
    ? user_rewards.map((reward) =>
        reward.rewards_info.map(({ info, amount }) => {
          const token1UstPair = getUstPair(info.token.contract_addr)
          const t1Detail = findTokenDetailFn(info.token.contract_addr)
          const token1Price =
            isNative(t1Detail?.tokenSymbol) && t1Detail?.tokenSymbol === "uusd"
              ? "1"
              : findPairPoolPriceFn?.(
                  token1UstPair ?? "",
                  info.token.contract_addr
                ) ?? "0"
          const calAmount = check8decOper(info.token.contract_addr)
            ? adjustAmount(true, true, div(amount, SMALLEST))
            : div(amount, SMALLEST)
          return multiple(calAmount, token1Price)
        })
      )
    : []
}

export function calculateAPR(totalPricesArray, tvl: string) {
  const a1 =
    totalPricesArray && totalPricesArray.length > 0
      ? totalPricesArray.reduce((a, b) => plus(a, b))
      : "0"

  const b = plus(multiple(a1, 365), multiple("0", "52"))
  const c = div(b, tvl)
  const d = div(c, "365")
  const e = plus("1", d)
  const f = new BigNumber(e).pow(365)
  const g = minus(f, "1")
  return multiple(g, "100")
}

export function calculateAPR2({ totalLocked, lpToken, totalPricesArray, sevenDaysFee, tvl}:{
  totalPricesArray,
  tvl: string,
  sevenDaysFee?: string,
  totalLocked?: string,
  lpToken?: string}) {
  const a1 =
    totalPricesArray && totalPricesArray.length > 0
      ? totalPricesArray.reduce((a, b) => plus(a, b))
      : "0"
  const a = multiple(a1, "365")
  const b = div(a, gt(tvl,"0") ? tvl : "1")
  const c = div(multiple(sevenDaysFee, "52"), gt(totalLocked ?? "0", "0") ? totalLocked : "1")
  const d = plus(b, c)
  return multiple(d, "100")
}

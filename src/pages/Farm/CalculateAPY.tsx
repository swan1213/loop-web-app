import { DistributableTokensByPool } from "../../data/farming/stakeUnstake"
import React, { memo, useEffect, useState } from "react"
import {div, gt, lte, minus, multiple, number, plus, pow} from "../../libs/math"
import {
  commas,
  decimal,
  isNative,
  lookupSymbol,
  niceNumber,
  numbers,
} from "../../libs/parse"
import BigNumber from "bignumber.js"
import styles from "../Dashboard/TopTrading.module.scss"
import { FarmContractTYpe } from "../../data/farming/FarmV2"
import { bound } from "../../components/Boundary"
import {
  calculateAPR2,
  useCalculatePrice,
  useCalculatePriceFarm2,
} from "./CalculateAPR"
import {
  useFindPairPoolPrice,
  useGetTokenInfoQuery,
} from "../../data/contract/info"
import { useFarmRewardsRowFarm2 } from "./FarmRewardsRow"
import { FarmReward } from "./FarmRewards"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder"
import {useProtocol} from "../../data/contract/protocol";

interface FinalAPY {
  symbol?: string
  tvl: string
  lpToken: string
  all_rewards: DistributableTokensByPool[] | undefined
  totalPricesArray: string[]
  sevenDaysFee?: string
  totalLocked?: string
  farmContractType: FarmContractTYpe | undefined
  setCombinedAPY:any
}
export const CalculateAPY = ({
  tvl,
  lpToken,
  all_rewards,
  totalPricesArray,
}: {
  tvl: string
  lpToken: string
  all_rewards: DistributableTokensByPool[] | undefined
  totalPricesArray: string[]
}) => {
  const price = useCalculatePrice(all_rewards, lpToken)
  const allTVL = decimal(plus(price, tvl), 2)
  const APY = calculateAPY(totalPricesArray, allTVL)

  return (
    <>
      {gt(APY, "0") ? (
        isNaN(number(APY)) ? (
          "0%"
        ) : (
          <span className={styles.blue}>
            {gt(APY, "50000")
              ? "50000"
              : numbers(
                  decimal(
                    isFinite(number(niceNumber(APY))) ? niceNumber(APY) : "0",
                    2
                  )
                )}
            %
          </span>
        )
      ) : (
        <small>Coming Soon...</small>
      )}
    </>
  )
}
export function calculateAPY(totalPricesArray, tvl: string) {
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

export function CalculateAPYFarm2({
  tvl,
  lpToken,
  all_rewards,
  totalPricesArray,
  sevenDaysFee,
  farmContractType,
}: {
  tvl: string
  lpToken: string
  all_rewards: DistributableTokensByPool[] | undefined
  totalPricesArray: string[]
  sevenDaysFee?: string
  totalLocked?: string
  farmContractType: FarmContractTYpe | undefined
}) {
  const price = useCalculatePriceFarm2({
    all_rewards,
    lpToken,
    type: farmContractType,
  })
  // const price33 = useRecoilValue(farmRewards({ type: farmContractType ?? FarmContractTYpe.Farm2, lpToken}))

  const [allTVL, setAllTVL] = useState<string>("0")
  useEffect(() => {
    setAllTVL(decimal(plus(price, tvl), 2))
  }, [price, tvl])

  const [APY, setAPY] = useState<string>("0")
  useEffect(() => {
    setAPY(niceNumber(calculateAPY2(totalPricesArray, allTVL, sevenDaysFee)))
  }, [allTVL, totalPricesArray, sevenDaysFee])

  return (
    <>
      {bound(
        gt(APY, "0") ? (
          !isFinite(number(APY)) || isNaN(number(APY)) ? (
            "0%"
          ) : (
            <span className={styles.blue}>
              {gt(APY, "50000")
                ? "50,000+ "
                : commas(
                    decimal(
                      isFinite(number(niceNumber(APY))) ? niceNumber(APY) : "0",
                      2
                    )
                  )}
              %
            </span>
          )
        ) : (
          <small>Coming Soon...</small>
        ),
        <small>Coming Soon...</small>
      )}
    </>
  )
}

/*export function SimpleCalculateAPYFarm2({
                                    lpToken,
                                    pair,
                                    farmContractType,
                                          all_staked,
                                  }: {
  lpToken: string
  pair: string
  farmContractType: FarmContractTYpe | undefined
  all_staked: string
}) {
  const findListOfDistributableTokensFn = useFindlistOfDistributableTokensByPoolFarm2(farmContractType ?? FarmContractTYpe.Farm2)
  const findPairPoolPriceFn = useFindPairPoolPrice()
  const { getUstPair } = useProtocol()
  const getPool = usePoolDynamic()
  const findPairPool = useFindPairPool()
  const findSevenDayFee = useFindSevenDayFee()

  const { hash: type } = useHash<Type>(Type.WITHDRAW)

  const all_rewards = findListOfDistributableTokensFn(lpToken)
  const sevenDaysFee = findSevenDayFee(pair)
  const poolResult: any = findPairPool(pair)

  function calculateTVL(poolData) {
    const assetAmount = div(poolData.fromLP.asset.amount, SMALLEST)
    const uusdAmount = div(poolData.fromLP.uusd.amount, SMALLEST)
    const token1UstPair = getUstPair(poolData.fromLP.asset.token)
    const token2UstPair = getUstPair(poolData.fromLP.uusd.token)
    const token1Price =
        isNative(poolData.fromLP.asset.token) &&
        poolData.fromLP.asset.token === "uusd"
            ? "1"
            : findPairPoolPriceFn?.(
            token1UstPair ?? "",
            poolData.fromLP.asset.token
        ) ?? "0"

    const token2Price =
        isNative(poolData.fromLP.uusd.token) &&
        poolData.fromLP.uusd.token === "uusd"
            ? "1"
            : findPairPoolPriceFn?.(
            token2UstPair ?? "",
            poolData.fromLP.uusd.token
        ) ?? "0"

    return plus(
        multiple(assetAmount, token1Price),
        multiple(uusdAmount, token2Price)
    )
  }
  let tvl = "0"

  const all_pool = getPool({
    amount: all_staked,
    token: lpToken,
    token2: UST,
    pairPoolResult: poolResult,
    type,
  })

  if (all_pool.fromLP) {
    tvl = decimal(calculateTVL(all_pool), 6)
  }

  let totalPricesArray: string[] = []
  all_rewards &&
  all_rewards.map((reward) => {
    const { info, daily_reward } = reward
    const price =
        findPairPoolPriceFn?.(
            getUstPair(info.token.contract_addr) ?? "",
            info.token.contract_addr
        ) ?? "0"
    return price
        ? totalPricesArray.push(
            multiple(price, div(multiple(daily_reward, "24"), SMALLEST)) ??
            "0"
        )
        : "0"
  })

  const price  = useCalculatePriceFarm2({all_rewards, lpToken, type: farmContractType})

  const [allTVL, setAllTVL] = useState<string>("0")
  useEffect(()=>{
    setAllTVL(decimal(plus(price, tvl), 2))
  }, [price, tvl])

  const [APY, setAPY] = useState<string>("0")
  useEffect(()=>{
    setAPY(niceNumber(calculateAPY2(totalPricesArray, allTVL, sevenDaysFee)))
  }, [allTVL, totalPricesArray, sevenDaysFee])

  return (
      <>
        { bound( gt(APY ?? "0", "0")? (
            (!isFinite(number(APY)) || isNaN(number(APY))) ? (
                "0%"
            ) : (
                <span className={styles.blue}>
            {gt(APY, "50000")
                ? "50,000+ "
                : commas(
                    decimal(
                        isFinite(number(niceNumber(APY))) ? niceNumber(APY) : "0",
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
}*/

const useCalculateFinalAPY = ({
                             tvl,
                             lpToken,
                             all_rewards,
                             totalPricesArray,
                             sevenDaysFee,
                             totalLocked,
                             farmContractType,
                           }: FinalAPY) => {
  // const price33 = useRecoilValue(farmRewards({ type: farmContractType ?? FarmContractTYpe.Farm2, lpToken}))
  const price = useCalculatePriceFarm2({
    all_rewards,
    lpToken,
    type: farmContractType,
  })
  const [allTVL, setAllTVL] = useState<string>("0")
  useEffect(() => {
    setAllTVL(decimal(plus(price, tvl), 2))
  }, [price, tvl])

  const [APY, setAPY] = useState<string>("0")
  useEffect(() => {
    setAPY(
        calculateAPR2({
          totalPricesArray,
          tvl: allTVL,
          sevenDaysFee,
          totalLocked,
        })
    )
  }, [allTVL, totalPricesArray, sevenDaysFee, totalLocked])

  const finalAPR = decimal(
      isFinite(number(niceNumber(APY))) ? niceNumber(APY) : "0",
      2
  )
  const finalAPY = multiple(
      minus(pow(plus(div(div(finalAPR, 100), "52"), "1"), "52"), "1"),
      "100"
  )
  return {
    finalAPY,
    finalAPR
  }
}
export function SimpleCalculateAPYFarm2(Prop: FinalAPY) {
  const {symbol} = Prop
  const setCombinedAPY=Prop.setCombinedAPY;
  const { finalAPY, finalAPR} = useCalculateFinalAPY(Prop)
  setCombinedAPY(
    gt(finalAPR, "0")  ? (
      !isFinite(number(finalAPY)) || isNaN(number(finalAPY)) ? (
        "0"
      ) : (
        gt(finalAPY, "50000")
        ? "50,001"
        : commas(
            decimal(
              isFinite(number(niceNumber(finalAPY)))
                ? (
                  niceNumber(symbol== 'LunaX - LUNA' ? plus(11.6,finalAPY) : finalAPY )
                )
                : "0",
              2
            )
          )
    
      )
    ) : (
      "0"
    )
  )


  return (
    <>
      {bound(
        gt(finalAPR, "0")  ? (
          !isFinite(number(finalAPY)) || isNaN(number(finalAPY)) ? (
            "0%"
          ) : (
            <span>
              {gt(finalAPY, "50000")
                ? "50,000+ "
                : commas(
                    decimal(
                      isFinite(number(niceNumber(finalAPY)))
                        ? (
                          niceNumber(symbol== 'LunaX - LUNA' ? plus(11.6,finalAPY) : finalAPY )
                        )
                        : "0",
                      2
                    )
                  )}
              %
            </span>
          )
        ) : (
          <LoadingPlaceholder color={"green"} size={"sm"} />
        ),
        <LoadingPlaceholder color={"green"} size={"sm"} />
      )}
    </>
  )
}
export const MemoizSimpleCalculateAPYFarm2 = memo(SimpleCalculateAPYFarm2)
// export const MemoizCalculateAPYFarm2 = memo(CalculateAPYFarm2)

export function CalculateTxFeeAPY(props: {
  tvl: string
  sevenDaysFee?: string
  total_locked: string
  farmType: FarmContractTYpe
  all_rewards: any
  forFarm: boolean
  lpToken: string
  farmContractType: FarmContractTYpe
  totalPricesArray: any[]
}) {
  const {
    total_locked,
    all_rewards,
    sevenDaysFee,
    tvl,
    forFarm,
    lpToken,
    farmContractType,
    totalPricesArray,
  } = props

  const price = useCalculatePriceFarm2({
    all_rewards,
    lpToken,
    type: farmContractType,
  })
  // const price33 = useRecoilValue(farmRewards({ type: farmContractType ?? FarmContractTYpe.Farm2, lpToken}))

  const [allTVL, setAllTVL] = useState<string>("0")
  useEffect(() => {
    setAllTVL(decimal(plus(price, tvl), 2))
  }, [price, tvl])

  const [APY, setAPY] = useState<string>("0")
  useEffect(() => {
    setAPY(
      calculateAPR2({
        totalPricesArray,
        tvl: allTVL,
        sevenDaysFee: "0",
        totalLocked: total_locked,
      })
    )
  }, [allTVL, totalPricesArray, sevenDaysFee, total_locked])

  return (
    <div>
      <span className={styles.d_flex_row}>
        <h3>Tx Fees:</h3>
        <h3>
          {" "}
          {decimal(
            niceNumber(
              calculateAPR2({
                totalPricesArray: [],
                tvl,
                totalLocked: total_locked ?? "0",
                sevenDaysFee,
              })
            ),
            3
          )}
          % APR
        </h3>
      </span>
      {gt(APY, "0") && (
        <span className={styles.d_flex_row}>
          <h3>Rewards:</h3>
          <h3> {decimal(niceNumber(APY), 3)}% APR</h3>
        </span>
      )}
      {/*{
        all_rewards &&
        all_rewards.map((reward) => <CalculateRewardsAPY tvl={tvl} forFarm={forFarm} farmType={farmType} total_locked={total_locked} item={reward} />)
    }*/}
    </div>
  )
}

export const MemoizCalculateTxFeeAPY = memo(CalculateTxFeeAPY)

export const CalculateRewardsAPY = ({
  item,
  farmType,
  forFarm,
  tvl,
  total_locked,
}: {
  item: FarmReward
  farmType: FarmContractTYpe
  forFarm: boolean
  tvl: string
  total_locked: string
}) => {
  const getTokenInfoFn = useGetTokenInfoQuery()
  const { getUstPair } = useProtocol()
  const findPairPoolPriceFn = useFindPairPoolPrice()

  const { info } = item
  const token = info.token !== undefined ? info.token.contract_addr : ""
  const contractSymbol =
    info.token !== undefined
      ? getTokenInfoFn?.(info.token.contract_addr)?.symbol
      : ""
  const price =
    findPairPoolPriceFn?.(
      getUstPair(info.token.contract_addr) ?? "",
      info.token.contract_addr
    ) ?? "0"
  const totalHours = useFarmRewardsRowFarm2(item, farmType)
  return (
    <span className={styles.d_flex_row}>
      <h3>
        {isNative(token)
          ? ` ${lookupSymbol(token)}`
          : ` ${lookupSymbol(contractSymbol)}`}{" "}
        APY
      </h3>
      <h2 className={styles.blue}>
        {decimal(
          calculateAPY2(
            [multiple(totalHours, price)],
            forFarm ? tvl ?? "0" : total_locked ?? "0",
            "0"
          ),
          3
        )}
        %
      </h2>
    </span>
  )
}

export function calculateAPY2(
  totalPricesArray,
  TVL: string,
  sevenDaysFee?: string
) {
  /*const a1 =
    totalPricesArray && totalPricesArray.length > 0
      ? totalPricesArray.reduce((a, b) => plus(a, b))
      : "0"
  const b = plus(multiple(a1, 365), multiple(gt(sevenDaysFee ?? "0", "0") ? sevenDaysFee : "1", "52"))
  const c = div(b, gt(TVL, "0") ? TVL : "1")
  const d = div(c, "365")
  const e = plus("1", d)
  const f = pow(e, 365)
  const g = minus(f, "1")
  return multiple(g, "100")*/

  const a1 =
    totalPricesArray && totalPricesArray.length > 0
      ? totalPricesArray.reduce((a, b) => plus(a, b))
      : "0"
  const a = multiple(a1, 365)
  const b = div(a, gt(TVL, "0") ? TVL : "1")
  const c = div(multiple(sevenDaysFee, "52"), gt(TVL, "0") ? TVL : "1")
  const d = plus(b, c)
  const f = multiple(d, "100")

  return f //multiple(minus(pow(plus(div(div(f, "100"), "365"), "1"), "365"),"1"), "100")
}

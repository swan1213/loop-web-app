import {SMALLEST, UST} from "../../constants"
import {div, gt, lt, multiple, number, plus} from "../../libs/math"
import {adjustAmount, isNative} from "../../libs/parse"
import {useContractsAddress} from "../../hooks"
import {
    CalculateAPY,
    MemoizCalculateTxFeeAPY, MemoizSimpleCalculateAPYFarm2,
} from "../Farm/CalculateAPY"
import {
    FarmContractTYpe,
    useFindFarminglpTokenBalanceFarm2,
    useFindlistOfDistributableTokensByPoolFarm2,
    useStakeableListFarmType,
} from "../../data/farming/FarmV2"
import usePoolDynamic from "../../forms/Pool/usePoolDynamic"
import {Type} from "../PoolDynamic"
import {useFindSevenDayFee, useTotalVolumeByPair,} from "../../data/contract/statistic"
import {getLpTokenInfoQuery, useFindPairPoolPrice, useTokenMethods,} from "../../data/contract/info"
import {useFindlistOfDistributableTokensByPool} from "../../data/farming/stakeUnstake"
import {useRecoilValue} from "recoil"
import {MemoizedCalculateAPRFarm2} from "../Farm/CalculateAPR"
import {useFarms, useFindPairPool} from "../../data/contract/normalize"
import {useProtocol} from "../../data/contract/protocol";


const useTopTradingList = () => {
    const list = useFarms()
  const findSevenDayFee = useFindSevenDayFee()
  const { check8decOper } = useTokenMethods()
  const volumeByPairList = useTotalVolumeByPair().contents
  const findPairPoolPriceFn = useFindPairPoolPrice()
  const findListOfDistributableTokensFn =
    useFindlistOfDistributableTokensByPool()
  const getTokenInfoFn = useRecoilValue(getLpTokenInfoQuery)
  // const farminglpTokenBalanceParsedFarm2TypeFn = useRecoilValue(farminglpTokenBalanceParsedFarm2Type)
  // const findFarminglpTokenBalanceFn = useFindFarminglpTokenBalance()
  // const findTokenDetailFn = useFindTokenDetails()
  const findListOfDistributableTokensFn2 =
    useFindlistOfDistributableTokensByPoolFarm2(FarmContractTYpe.Farm2)
    const findListOfDistributableTokensFn3 =
        useFindlistOfDistributableTokensByPoolFarm2(FarmContractTYpe.Farm3)
  const findFarminglpTokenBalanceFn2 = useFindFarminglpTokenBalanceFarm2(FarmContractTYpe.Farm2)
  const findFarminglpTokenBalanceFn3 = useFindFarminglpTokenBalanceFarm2(FarmContractTYpe.Farm3)
  const { getUstPair } = useProtocol()
  const findPairPool = useFindPairPool()
  const getPool = usePoolDynamic()
  const type = Type.WITHDRAW

  let allTVL = "0"
  // let allTVL2 = "0"
  let volume = "0"
  const findStakeableListFarmType = useStakeableListFarmType()


    /*function getFarmLpBalance (lp: string, type: FarmContractTYpe) {
        const list = farminglpTokenBalanceList.find((item)=> item.type === type)
        console.log("listlistlist", list, type, farminglpTokenBalanceList)
        if(list){
            return list.data[lp] ?? "0"
        }
        return "0"
    }*/

  function calculateTVL(poolData) {
    const assetAmount = check8decOper(poolData.fromLP.asset.token)
      ? adjustAmount(true, true, div(poolData.fromLP.asset.amount, SMALLEST))
      : div(poolData.fromLP.asset.amount, SMALLEST)
    const uusdAmount = check8decOper(poolData.fromLP.uusd.token)
      ? adjustAmount(true, true, div(poolData.fromLP.uusd.amount, SMALLEST))
      : div(poolData.fromLP.uusd.amount, SMALLEST)

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
      multiple(
        assetAmount,
        check8decOper(poolData.fromLP.asset.token)
          ? multiple(token1Price, "100")
          : token1Price
      ),
      multiple(
        uusdAmount,
        check8decOper(poolData.fromLP.uusd.token)
          ? multiple(token2Price, "100")
          : token2Price
      )
    )
  }
    // const farminglpTokenBalanceQueryFarmingFn = useFarminglpTokenBalanceQueryFarming()
    // const farminglpTokenBalanceQueryFarmingFn = useRecoilValue(farminglpTokenBalanceFn)

  return list &&
    list
      .map((li) => {
        let total_locked = "0"
        // const total_lockedFn = findPairTVLFn(li.lpToken) ?? "0"
        const ifNativeTokens = li.tokens.find(
          (item) => item.native_token !== undefined
        )

        const poolResult: any = findPairPool(li.contract_addr)
        const sevenDaysFee = findSevenDayFee(li.contract_addr)
          const farmContractType = findStakeableListFarmType(li.lpToken)

          const all_staked2 = findFarminglpTokenBalanceFn2(li.lpToken)
          const all_staked3 = findFarminglpTokenBalanceFn3(li.lpToken)

        if (li.tokens) {
          const all_pool = getPool({
            amount: farmContractType?.type === FarmContractTYpe.Farm2  ? all_staked2 ?? "0" : all_staked3 ?? "0",
            token: li.lpToken,
            token2: UST,
            pairPoolResult: poolResult?.contents ? poolResult.contents : poolResult,
            type,
          })
          if (all_pool.fromLP) {
            allTVL = calculateTVL(all_pool)
          }
        }

        const totalSupply = getTokenInfoFn?.(li.lpToken)?.total_supply ?? "0"
        const userPool = getPool({
          amount: totalSupply,
          token: li.lpToken,
          token2: UST,
          pairPoolResult: poolResult,
          type,
        })
        if (userPool.fromLP) {
          total_locked = calculateTVL(userPool)
        }

        // if both tokens are non-natives
        if (!ifNativeTokens) {
          const tokenUstPrices = li.tokens.map((token) => {
            if (
              token.native_token !== undefined &&
              token.native_token.denom === "uusd"
            ) {
              return "1"
            } else {
              const t1 = token.native_token
                ? token.native_token.denom
                : token.token?.contract_addr ?? ""
              return findPairPoolPriceFn?.(getUstPair(t1) ?? "", t1) ?? "0"
            }
          })
          volume = multiple(
            div(
              tokenUstPrices.reduce((a, b) => plus(a, b)),
              2
            ),
            volumeByPairList?.[li.contract_addr] ?? "0"
          )
        }

        // const all_staked2 = findFarminglpTokenBalanceFn2(li.lpToken)
       /* const all_staked2 = findFarminglpTokenBalanceFn2(li.lpToken)
        const all_staked3 = findFarminglpTokenBalanceFn3(li.lpToken)

        if (li.tokens) {
          const poolResult: any = findPairPool(li.contract_addr)
          const all_pool = getPool({
            amount: all_staked2 ?? all_staked3 ?? "0",
            token: li.lpToken,
            token2: UST,
            pairPoolResult: poolResult,
            type,
          })
          if (all_pool.fromLP) {
              console.log("poolResult", poolResult, li.lpToken)
              allTVL2 = multiple(decimal(calculateTVL(all_pool), 6), SMALLEST)
          }
        }*/
        //@ts-ignore
        // const perLPValue = div(total_liquidity, totalSupply)

        // const allTVL = div(multiple(perLPValue, all_staked), SMALLEST)

        const all_rewards = findListOfDistributableTokensFn(li.lpToken)
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
                  multiple(price, div(daily_reward, SMALLEST)) ?? "0"
                )
              : "0"
          })


        const all_rewards2 = findListOfDistributableTokensFn2(li.lpToken)
        const all_rewards3 = findListOfDistributableTokensFn3(li.lpToken)

        let totalPricesArray2: string[] = []
        all_rewards2 &&
          all_rewards2.map((reward) => {
            const { info, daily_reward } = reward
            const price =
              findPairPoolPriceFn?.(
                getUstPair(info.token.contract_addr) ?? "",
                info.token.contract_addr
              ) ?? "0"
            return price
              ? totalPricesArray2.push(
                  multiple(
                    price,
                    div(multiple(daily_reward, "24"), SMALLEST)
                  ) ?? "0"
                )
              : "0"
          })

          let totalPricesArray3: string[] = []
          all_rewards3 &&
          all_rewards3.map((reward) => {
              const { info, daily_reward } = reward
              const price =
                  findPairPoolPriceFn?.(
                      getUstPair(info.token.contract_addr) ?? "",
                      info.token.contract_addr
                  ) ?? "0"
              return price
                  ? totalPricesArray3.push(
                      multiple(
                          price,
                          div(multiple(daily_reward, "24"), SMALLEST)
                      ) ?? "0"
                  )
                  : "0"
          })

        const totalLocked = multiple(
            multiple(total_locked, SMALLEST),
            li.lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                ? "2"
                : "1"
        )

        // @ts-ignore
        return {
          ...li,
          volume: !ifNativeTokens
            ? volume
            : volumeByPairList?.[li.contract_addr] ?? "0",
          total_fee: findSevenDayFee(li.contract_addr),
          total_locked: totalLocked,
          apr: (
            <CalculateAPY
              totalPricesArray={totalPricesArray}
              lpToken={li.lpToken}
              all_rewards={all_rewards}
              tvl={
                isNaN(number(allTVL))
                  ? "0"
                  : multiple(
                      allTVL,
                      li.lpToken ===
                        "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                        ? "2"
                        : "1"
                    )
              }
            />
          ),
           /* all_apy: (
                <MemoizSimpleCalculateAPYFarm2
                    pair={li.contract_addr}
                    farmContractType={farmContractType?.type ?? FarmContractTYpe.Farm2}
                    all_staked={farmContractType?.type === FarmContractTYpe.Farm2  ? all_staked2 ?? "0" : all_staked3 ?? "0"}
                    lpToken={li.lpToken}
                />
            ),*/
            /*tx_fee_apy: (
                bound(<MemoizCalculateTxFeeAPY
                    sevenDaysFee={sevenDaysFee}
                    all_rewards={farmContractType?.type === FarmContractTYpe.Farm2 ? all_rewards2 : all_rewards3}
                    total_locked={div(totalLocked, SMALLEST)}
                    farmType={farmContractType?.type}
                    forFarm={false}
                    tvl={
                        isNaN(number(allTVL))
                            ? "0"
                            : multiple(
                                allTVL,
                                li.lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                                    ? "2"
                                    : "1"
                            )
                    }
                />, 'fetching...')
            ),*/
            all_apr: (
                <MemoizedCalculateAPRFarm2
                    totalLocked={div(totalLocked, SMALLEST)}
                    sevenDaysFee={sevenDaysFee}
                    totalPricesArray={farmContractType?.type === FarmContractTYpe.Farm2 ? totalPricesArray2 : totalPricesArray3}
                    lpToken={li.lpToken}
                    all_rewards={farmContractType?.type === FarmContractTYpe.Farm2 ? all_rewards2 : all_rewards3}
                    farmContractType={farmContractType?.type ?? FarmContractTYpe.Farm2}
                    tvl={
                        isNaN(number(allTVL))
                            ? "0"
                            : multiple(
                                allTVL,
                                li.lpToken ===
                                "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                                    ? "2"
                                    : "1"
                            )
                    }
                />
            ),
        }
      })
      .filter((li) => gt(li.total_fee, 0) && gt(li.total_locked, 0))
      .sort((a, b) => (lt(a.total_fee, b.total_fee) ? 1 : -1))
}
export default useTopTradingList

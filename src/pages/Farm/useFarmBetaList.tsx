import {getLpTokenInfoQuery, useFindPairPoolPrice, useTokenMethods} from "../../data/contract/info"
import {div, gt, lt, multiple, number, plus} from "../../libs/math"
import {LIST} from "../../hooks/Farm/useFarmingList"
import {SMALLEST, UST} from "../../constants"
import {FarmUserRewardsFarm2} from "./FarmUserRewards"
import {FarmRewardsFarm2} from "./FarmRewards"
import {adjustAmount, commas, decimal, isNative, niceNumber,} from "../../libs/parse"
import usePoolDynamic from "../../forms/Pool/usePoolDynamic"
import {Type} from "../PoolDynamic"
import {MemoizCalculateTxFeeAPY, SimpleCalculateAPYFarm2} from "./CalculateAPY"
import {useFindSevenDayFee} from "../../data/contract/statistic"
import CalculateUserTVL from "./CalculateUserTVL"
import {FarmUserRewardPerSecondFarm2, FarmUserRewardPerSecondFarm4} from "./FarmUserRewardPerSecond"
import {
    FarmContractTYpe,
    getTotalStakedForFarmingQuery,
    useFindFarminglpTokenBalanceFarm2,
    useFindlistOfDistributableTokensByPoolFarm2,
    useFindStakedByUserFarmQueryFarm2,
    useFindUserRewardInPoolFarm2,
    useStakeableListFarm2,
} from "../../data/farming/FarmV2"
import {
    FactoryType,
    useFarms,
    useFindPairPool,
    useLOOPPrice,
    useLpTokenBalancesQuery
} from "../../data/contract/normalize"
import {calculateAPR2, CalculateAPRFarm2} from "./CalculateAPR"
import {bound} from "../../components/Boundary"
import {useRecoilValue} from "recoil"
import React, { useState } from "react"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder"
import {useProtocol} from "../../data/contract/protocol"
import {
    getTotalStakedForFarming4Query,
    useFindStakedByUserFarmQueryFarm4,
    usePoolPairPoolList
} from "../../data/contract/migrate";

const useFarmBetaList = (FarmType: FarmContractTYpe, list: any[], forFarm: boolean = false) => {
    const listofStakeable = useStakeableListFarm2(FarmType)
    const { check8decOper } = useTokenMethods()
    const findUserRewardInPoolFarm2Fn = useFindUserRewardInPoolFarm2(FarmType)
    const findListOfDistributableTokensFn =
        useFindlistOfDistributableTokensByPoolFarm2(FarmType)
    const findStakedByUserFarmFn = useFindStakedByUserFarmQueryFarm2(FarmType)
    const findStakedByUserFarm4Fn = useFindStakedByUserFarmQueryFarm4()
    const findFarminglpTokenBalanceFn = useFindFarminglpTokenBalanceFarm2(FarmType)
    // const getTokenSupplyFn = useRecoilValue(findTokenInfoTotalSupply)
    const getTokenInfoFn = useRecoilValue(getLpTokenInfoQuery)
    const { getUstPair } = useProtocol()
    const findPairPoolPriceFn = useFindPairPoolPrice()
    const findPairPool = useFindPairPool()
    const { contents: pairPools} =usePoolPairPoolList()
    const getPool = usePoolDynamic()
    // const findLpBalance = useGetLpTokenBalance()
    const { contents: lpTokenBalances } = useLpTokenBalancesQuery()
    const findSevenDayFee = useFindSevenDayFee()
    const [combinedApy,setCombinedApy]=useState<any>('')
    const loopPrice=useLOOPPrice()?.contents
    const type = Type.WITHDRAW


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

    let allTVL = "0"
    let total_locked = "0"
    let userTVL = "0"
    const total_stakedListFarm4 = useRecoilValue(getTotalStakedForFarming4Query(FarmType))

    return list
        .filter((item) => {
            return forFarm ? listofStakeable && listofStakeable.includes(item.lpToken) : true
        })
        .map((item: LIST) => {
            const { lpToken, symbol, tokens } = item
            const all_rewards = findListOfDistributableTokensFn(lpToken)

            const staked = FarmType === FarmContractTYpe.Farm4 ? findStakedByUserFarm4Fn(lpToken) : findStakedByUserFarmFn(lpToken)

            const all_staked = FarmType ===  FarmContractTYpe.Farm4 ? total_stakedListFarm4?.[lpToken] ?? "0" : findFarminglpTokenBalanceFn(lpToken) ?? ""
            const sevenDaysFee = findSevenDayFee(item.contract_addr)
            const poolResult: any = FarmType === FarmContractTYpe.Farm4 ? pairPools[item.contract_addr] : findPairPool(item.contract_addr)

            if (tokens) {

                const all_pool = getPool({
                    amount: all_staked,
                    token: item.lpToken,
                    token2: UST,
                    pairPoolResult: poolResult,
                    type,
                })
                if (all_pool.fromLP) {
                    allTVL = decimal(calculateTVL(all_pool), 6)
                }

                const userPool = getPool({
                    amount: staked,
                    token: item.lpToken,
                    token2: UST,
                    pairPoolResult: poolResult,
                    type,
                })
                if (userPool.fromLP) {
                    userTVL = decimal(calculateTVL(userPool), 6)
                }
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

            // const userAPY  = calculateAPY(totalUserPricesArray, userTVL)
            const allAPR = calculateAPR2({totalPricesArray, tvl:allTVL})

            const receivedRewards = findUserRewardInPoolFarm2Fn(lpToken)
            const loopReward =
                all_rewards &&
                all_rewards.map((reward) =>{
                    return(
                        decimal(multiple(multiple(div(multiple(reward?.daily_reward,24),SMALLEST),loopPrice),7),4)
                    )
                })
            const loopRewards = loopReward && loopReward.length > 0 && loopReward.reduce((a,b)=>plus(a,b))

            const totalSupply = getTokenInfoFn?.(lpToken)?.total_supply ?? "0"
            const userPool = getPool({
                amount: totalSupply,
                token: lpToken,
                token2: UST,
                pairPoolResult: poolResult?.contents ? poolResult.contents : poolResult,
                type,
            })
            if (userPool.fromLP) {
                total_locked = calculateTVL(userPool)
            }

            const totalLocked = multiple(
                multiple(total_locked, SMALLEST),
                lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                    ? "2"
                    : "1"
            )

            return {
                ...item,
                FarmContractType: FarmType,
                symbol: symbol ?? "",
                loopRewards: loopRewards ?? "0",
                combined_apy: combinedApy,
                rewards_beta: (
                    FarmType === FarmContractTYpe.Farm4 ?  <FarmUserRewardPerSecondFarm4 farmContractType={FarmType} lp={lpToken} data={all_rewards} /> : <FarmUserRewardPerSecondFarm2 farmContractType={FarmType} lp={lpToken} data={all_rewards} />
                ),
                rewards: <FarmUserRewardsFarm2 data={receivedRewards} />,
                all_rewards:
                    all_rewards && all_rewards?.length > 0 ? (
                        <FarmRewardsFarm2 farmType={FarmType} data={all_rewards}/>
                    ) : (
                        <LoadingPlaceholder />
                    ),
                apr: gt(allAPR, "50000")
                    ? "50,000+ "
                    : commas(
                        decimal(
                            isFinite(number(niceNumber(allAPR))) ? niceNumber(allAPR) : "0",
                            2
                        )
                    ),
                all_apy: bound(<SimpleCalculateAPYFarm2
                        symbol={symbol}
                        setCombinedAPY={setCombinedApy}
                        totalLocked={div(totalLocked, SMALLEST)}
                        sevenDaysFee={sevenDaysFee}
                        totalPricesArray={totalPricesArray}
                        lpToken={lpToken}
                        all_rewards={all_rewards}
                        farmContractType={FarmType}
                        tvl={
                            isNaN(number(allTVL))
                                ? "0"
                                : multiple(
                                    allTVL,
                                    lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                                        ? "2"
                                        : "1"
                                )
                        }
                    />,
                    <LoadingPlaceholder size={'sm'} color={'green'} />),
                tx_fee_apy: (
                    bound(<MemoizCalculateTxFeeAPY
                        sevenDaysFee={sevenDaysFee}
                        all_rewards={all_rewards}
                        total_locked={div(totalLocked, SMALLEST)}
                        farmType={FarmType}
                        forFarm={forFarm}
                        lpToken={lpToken}
                        farmContractType={FarmType}
                        totalPricesArray={totalPricesArray}
                        tvl={
                            isNaN(number(allTVL))
                                ? "0"
                                : multiple(
                                    allTVL,
                                    lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                                        ? "2"
                                        : "1"
                                )
                        }
                    />, <LoadingPlaceholder  size={'sm'}  />)
                ),
                all_apr: (
                    <CalculateAPRFarm2
                        symbol={symbol}
                        totalLocked={div(totalLocked, SMALLEST)}
                        sevenDaysFee={sevenDaysFee}
                        totalPricesArray={totalPricesArray}
                        lpToken={lpToken}
                        all_rewards={all_rewards}
                        farmContractType={FarmType}
                        tvl={
                            isNaN(number(allTVL))
                                ? "0"
                                : multiple(
                                    allTVL,
                                    lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                                        ? "2"
                                        : "1"
                                )
                        }
                    />
                ),
                liquidity: isNaN(number(userTVL))
                    ? "0"
                    : multiple(
                        userTVL,
                        lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                            ? "2"
                            : "1"
                    ),
                all_liquidity: isNaN(number(allTVL))
                    ? "0"
                    : multiple(
                        allTVL,
                        lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                            ? "2"
                            : "1"
                    ),
                call_user_liquidity: (
                    <CalculateUserTVL
                        /*user_rewards={rewards}*/
                        tvl={
                            isNaN(number(userTVL))
                                ? "0"
                                : multiple(
                                    userTVL,
                                    lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                                        ? "2"
                                        : "1"
                                )
                        }
                    />
                ),
                call_liquidity: gt(allTVL, "0") ? (
                    `$${commas(
                        decimal(
                            multiple(
                                allTVL,
                                lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                                    ? "2"
                                    : "1"
                            ),
                            3
                        )
                    )}`
                ) : (
                    <LoadingPlaceholder />
                ),
                staked: staked ? div(staked, SMALLEST) : "0",
                total_fee: sevenDaysFee ?? "0",
                total_locked: totalLocked ?? "0",
                all_staked: bound(all_staked ? div(all_staked, SMALLEST) : "0", <LoadingPlaceholder color={'green'}  /> ),
                isOpen: false,
                totalValueUst: isNaN(number(userTVL))
                    ? "0"
                    : multiple(
                        userTVL,
                        lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                            ? "2"
                            : "1"
                    ),
                lp_balance: lpTokenBalances?.[item.lpToken],
                tvl: isNaN(number(userTVL))
                    ? "0"
                    : multiple(
                        userTVL,
                        lpToken === "terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd"
                            ? "2"
                            : "1"
                    )
            }
        })
}

export default useFarmBetaList

export const useFarmsList = (forFarm: boolean = false) => {
    const list = useFarms()

    const dataSource3: any = useFarmBetaList(FarmContractTYpe.Farm3, list, true)
    const dataSource2: any = useFarmBetaList(FarmContractTYpe.Farm2, list, forFarm).filter((item) => ![...dataSource3.map((item) => item.lpToken)].includes(item.lpToken))
    return [...dataSource2, ...dataSource3].sort((a, b) => (lt(a.combined_apy, b.combined_apy) ? 1 : -1))
}

export const useFarmsNewList = (forFarm: boolean = false) => {
    const list = useFarms(FactoryType.fac2)
    const dataSource2: any = useFarmBetaList(FarmContractTYpe.Farm4, list, forFarm)

    return [...dataSource2].sort((a, b) => (lt(a.combined_apy, b.combined_apy) ? 1 : -1))
}
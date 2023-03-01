import {
    useFindlistOfDistributableTokensByPool,
    useFindUserRewardInPool,
    useStakeableList
} from "../../data/farming/stakeUnstake"
import {
    useFindFarminglpTokenBalance,
    useFindStakedByUserFarmQuery
} from "../../data/contract/farming"
import {useFindPairPoolPrice} from "../../data/contract/info"
import {div, gt, multiple, number, plus} from "../../libs/math"
import {LIST} from "../../hooks/Farm/useFarmingList"
import { SMALLEST, UST} from "../../constants"
import FarmUserRewards from "./FarmUserRewards"
import FarmRewards from "./FarmRewards"
import {decimal, isNative, niceNumber} from "../../libs/parse"
import usePoolDynamic from "../../forms/Pool/usePoolDynamic"
import {Type} from "../PoolDynamic"
import useHash from "../../libs/useHash"
import {CalculateTVL} from "./CalculateTVL"
import CalculateUserTVL from "./CalculateUserTVL"
import FarmUserRewardPerSecond from "./FarmUserRewardPerSecond"
import {FarmContractTYpe} from "../../data/farming/FarmV2"
import {calculateAPY} from "./CalculateAPY";
import {useFarms, useFindPairPool} from "../../data/contract/normalize";
import {useProtocol} from "../../data/contract/protocol";

const useFarmList = () => {
    const list = useFarms()
    const listofStakeable = useStakeableList()
    const findUserRewardInPoolFn = useFindUserRewardInPool()
    const findListOfDistributableTokensFn = useFindlistOfDistributableTokensByPool()
    const findStakedByUserFarmFn = useFindStakedByUserFarmQuery()
    const findFarminglpTokenBalanceFn = useFindFarminglpTokenBalance()
    const { getUstPair } = useProtocol()
    const findPairPoolPriceFn = useFindPairPoolPrice()
    const findPairPool = useFindPairPool()
    const getPool = usePoolDynamic()

    const { hash: type } = useHash<Type>(Type.WITHDRAW)

    function calculateTVL(poolData){
        const assetAmount = div(poolData.fromLP.asset.amount, SMALLEST)
        const uusdAmount = div(poolData.fromLP.uusd.amount, SMALLEST)
        const token1UstPair = getUstPair(poolData.fromLP.asset.token)
        const token2UstPair = getUstPair(poolData.fromLP.uusd.token)
        const token1Price  = isNative(poolData.fromLP.asset.token) && poolData.fromLP.asset.token === 'uusd' ? "1" :  findPairPoolPriceFn?.(
            token1UstPair ?? "",
            poolData.fromLP.asset.token
        ) ?? "0"

        const token2Price  = isNative(poolData.fromLP.uusd.token) && poolData.fromLP.uusd.token === 'uusd' ? "1" :  findPairPoolPriceFn?.(
            token2UstPair ?? "",
            poolData.fromLP.uusd.token
        ) ?? "0";

        return plus(multiple(assetAmount, token1Price), multiple(uusdAmount, token2Price))
    }

    let allTVL = "0";
    let userTVL = "0";

    return (
        list
            .filter((item) => {
                return listofStakeable && listofStakeable.includes(item.lpToken)
            })
            .map( (item: LIST) => {
                const { lpToken, symbol, tokens } = item
                // let total_locked = "0"
                // const total_lockedFn = findPairTVLFn(lpToken) ?? "0"
                const rewards = findUserRewardInPoolFn(lpToken)
                const all_rewards = findListOfDistributableTokensFn(lpToken)
                const staked = findStakedByUserFarmFn(lpToken)
                const all_staked = findFarminglpTokenBalanceFn(lpToken)
                // const data = all_rewards && await getDistributedRewardaInPoolFn(all_rewards, lpToken);
                // if both are non natives
                /* const ifNativeTokens = tokens?.find(
                     (item) => item.native_token !== undefined
                 )
                 let volume = "0"*/

                if (tokens) {
                    const poolResult: any = findPairPool(item.contract_addr)
                    const all_pool = getPool({
                        amount: all_staked,
                        token: item.lpToken,
                        token2: UST,
                        pairPoolResult: poolResult?.contents ? poolResult.contents : poolResult,
                        type,
                    })
                    if(all_pool.fromLP) {
                        allTVL = calculateTVL(all_pool)
                    }

                    const userPool = getPool({
                        amount: staked,
                        token: item.lpToken,
                        token2: UST,
                        pairPoolResult: poolResult?.contents ? poolResult.contents : poolResult,
                        type,
                    })
                    if(userPool.fromLP) {
                        userTVL  = calculateTVL(userPool)
                    }

                    /*const tokenUstPrices = tokens.map((token) => {
                    if (token.native_token !== undefined && token.native_token.denom === 'uusd') {
                      return "1";
                    } else {
                      const t1 = token.native_token ? token.native_token.denom : token.token?.contract_addr ?? ""
                      return findPairPoolPriceFn?.(getUstPair(t1) ?? "", t1) ?? "0";
                    }
                  })
                  volume = multiple(div(tokenUstPrices.reduce((a, b) => plus(a, b)), 2), volumeByPairList?.[contract_addr] ?? "0")*/
                }

                // const volumeFinal =  !ifNativeTokens ? volume : volumeByPairList?.[contract_addr] ?? "0";
                // const fee7Day = multiple(div(volumeFinal, 100), 0.3)

                // const total_liquidity = total_locked
                // const totalSupply = findTokenInfoTotalSupplyFn?.(lpToken)

                // @ts-ignore
                // const perLPValue = div(total_liquidity, totalSupply)

                // let totalUserPricesArray: string[] = []
                // rewards.map((reward) =>
                //   reward.map((item) => {
                //     const { info } = item
                //     const price =
                //       findPairPoolPriceFn?.(
                //         getUstPair(info.token.contract_addr) ?? "",
                //         info.token.contract_addr
                //       ) ?? "0"
                //     return price
                //       ? totalUserPricesArray.push(
                //           multiple(price, div(item.amount, SMALLEST)) ?? "0"
                //         )
                //       : "0"
                //   })
                // )
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

                // const userAPY  = calculateAPY(totalUserPricesArray, userTVL)
                const allAPY = calculateAPY(totalPricesArray, allTVL)
                return {
                    ...item,
                    FarmContractType: FarmContractTYpe.Farm1,
                    symbol: symbol ?? "",
                    rewards_beta: <FarmUserRewardPerSecond farmContractType={FarmContractTYpe.Farm1} lp={lpToken} data={all_rewards} />,
                    rewards: <FarmUserRewards data={rewards} />,
                    all_rewards: <FarmRewards farmType={FarmContractTYpe.Farm1} data={all_rewards} />,
                    apr: gt(allAPY,"50000") ? "50000" :  decimal(
                        isFinite(number(niceNumber(allAPY))) ? niceNumber(allAPY) : "0",
                        2
                    ),
                    // all_apr: decimal(isFinite(number(niceNumber(allAPY)))  ? niceNumber(allAPY) :"0", 2),
                    all_apr: "0%",
                    liquidity: isNaN(number(userTVL)) ? "0" : userTVL,
                    all_liquidity: isNaN(number(allTVL)) ? "0" : allTVL,
                    call_user_liquidity: <CalculateUserTVL
                        /*user_rewards={rewards}*/
                        tvl={isNaN(number(userTVL)) ? "0" : userTVL}
                    />,
                    call_liquidity: <CalculateTVL lpToken={lpToken} all_rewards={all_rewards} tvl={isNaN(number(allTVL)) ? "0" : allTVL} />,
                    staked: staked ? div(staked, SMALLEST) : "0",
                    all_staked: all_staked ? div(all_staked, SMALLEST) : "0",
                    isOpen: false
                }
            })
    )
}

export default useFarmList

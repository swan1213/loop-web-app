import {sum, div, gt, multiple, plus} from "../../libs/math"
import { percent } from "../../libs/num"
import {useFetchTokens} from "../../hooks"
import usePoolShare from "../../forms/usePoolShare"
import usePoolDynamic from "../../forms/Pool/usePoolDynamic"
import { SMALLEST } from "../../constants"
import {decimal, isNative, lookupSymbol} from "../../libs/parse"
import {
  useFindPairPoolPrice,
  useGetTokenInfoQuery,
} from "../../data/contract/info"
import {
    useFindBalance,
    useFindPairPool, usePairPool,
} from "../../data/contract/normalize"
import {useProtocol} from "../../data/contract/protocol";

const usePairsList = () => {
  const { contractPairList } = useFetchTokens()
  const getTokenInfoFn = useGetTokenInfoQuery()

  return contractPairList.map(
      (contractPair: {
        asset_infos: {
          token?: { contract_addr: string }
          native_token?: { denom: string }
        }[]
        contract_addr: string
        liquidity_token: string
      }) => {
        const pairs = contractPair.asset_infos.map((info) => {
          if (info?.native_token !== undefined) {
            return {
              token: info.native_token.denom ?? "",
              symbol: lookupSymbol(info.native_token.denom) ?? "",
            }
          } else {
            const tokenInfo = getTokenInfoFn?.(info.token?.contract_addr ?? "")
            const symbol = lookupSymbol(tokenInfo?.symbol) ?? ""

            return { token: info.token?.contract_addr ?? "", symbol }
          }
        })
        return {
          pairs,
          token: contractPair.liquidity_token,
          name: pairs.map((pair) => pair.symbol).join(" - "),
          symbol: pairs.map((pair) => pair.symbol).join(" - "),
          lpToken: contractPair.liquidity_token,
          contract_addr: contractPair.contract_addr,
          pair: contractPair.contract_addr,
          status: "LISTED",
        }
      }
  )
}

const useMyPool = () => {
  const getTokenBalanceFn = useFindBalance()
    const { contents }  = usePairPool()

  const findPairPools = (token: string) => {
      return contents?.[token] ?? undefined
  }
  const list = usePairsList()

  const getPool = usePoolDynamic()
  const getPoolShare = usePoolShare()

  const { getUstPair } = useProtocol()
  const findPairPoolPriceFn = useFindPairPoolPrice()

  function calculateTVL(fromLP){
    const assetAmount = div(fromLP.asset.amount, SMALLEST)
    const uusdAmount = div(fromLP.uusd.amount, SMALLEST)
    const token1UstPair = getUstPair(fromLP.asset.token)
    const token2UstPair = getUstPair(fromLP.uusd.token)
    const token1Price  = isNative(fromLP.asset.token) && fromLP.asset.token === 'uusd' ? "1" :  findPairPoolPriceFn?.(
        token1UstPair ?? "",
        fromLP.asset.token
    ) ?? "0"

    const token2Price  = isNative(fromLP.uusd.token) && fromLP.uusd.token === 'uusd' ? "1" :  findPairPoolPriceFn?.(
        token2UstPair ?? "",
        fromLP.uusd.token
    ) ?? "0";

    return plus(multiple(assetAmount, token1Price), multiple(uusdAmount, token2Price))
  }

  const dataSource =
      list &&
      list.map((item) => {
      const { pairs, contract_addr, lpToken } = item
      const balance = getTokenBalanceFn?.(lpToken) ?? "0"

      const pairPoolResult = findPairPools?.(contract_addr) ?? undefined
          //@ts-ignore
      const { fromLP } = getPool({
        amount: balance ?? "0",
        token: pairs[0]?.token,
        token2: pairs[1]?.token,
          pairPoolResult: pairPoolResult,
        type: "provide",
      })

      const poolShare = getPoolShare({
        amount: div(balance ?? "0", SMALLEST),
        total: div(pairPoolResult?.total_share ?? "0", SMALLEST),
      })

      const { ratio, lessThanMinimum, minimum } = poolShare
      const prefix = lessThanMinimum ? "<" : ""
        const share =  (prefix + percent(lessThanMinimum ? minimum : ratio))

      const liq = calculateTVL(fromLP)
      const wtvalue=multiple(decimal(liq, 6), lpToken === 'terra1yy46j5xy7fykt6q58aa4u4y39h4fxc7jke2spd' ? "2" : "1")

      return {
        ...item,
        balance: balance ?? "0",
        withdrawable: fromLP,
        withdrawableValue: wtvalue,
        share,
      }
    }).filter((data) => gt(data.balance, 0))

  const totalWithdrawableValue = sum(
    dataSource
        .map(({ withdrawableValue }) => withdrawableValue)
  )

  return {
    keys: [],
    loading: false,
    dataSource,
    totalWithdrawableValue,
  }
}

export default useMyPool

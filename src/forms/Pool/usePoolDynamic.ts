import { times, floor, gt, plus, div } from "../../libs/math"
import {decimal, format, formatAsset, lookupSymbol } from "../../libs/parse"
import calc from "../../helpers/calc"
import { parsePairPoolForMultiTokens } from "../../graphql/useNormalize"
import { useFindTokenDetails } from "../../data/form/select";
import {useTokenMethods} from "../../data/contract/info";

export default (time?: number) => {
  const findTokenDetailFn = useFindTokenDetails()
  const { check8decOper } = useTokenMethods()

  /**
   * @param amount - Amount to provide(asset)/withdraw(lp)
   * @param token - Token of the asset to provide/withdraw
   */
  return ({
    amount,
    token,
    token2,
    pairPoolResult,
    type,
      time
  }: {
    amount: string
    token: string
    token2?: string
    pairPoolResult?: PairPool | undefined
    symbol?: string
    type: string,
    time?: number
  }) => {

    /* pair pool */
    const pairPool = pairPoolResult
      ? parsePairPoolForMultiTokens(pairPoolResult, token, type)
      : { uusd: "0", asset: "0", total: "0" }
    const assets0: any = pairPoolResult ? pairPoolResult?.assets?.[0] ?? "" : ""
    const assets1: any = pairPoolResult ? pairPoolResult?.assets?.[1] ?? "" : ""

    const token00 =
      assets0?.info?.native_token !== undefined
        ? assets0?.info?.native_token.denom
        : assets0?.info?.token.contract_addr
    const token11 =
      assets1?.info?.native_token !== undefined
        ? assets1?.info?.native_token.denom
        : assets1?.info?.token.contract_addr

    const pair = div(pairPool.asset, pairPool.uusd)

    // const oracle = find(PriceKey.ORACLE, token)
    const price = gt(pair, 0) ? pair : "0"

    /* estimate uusd */
    const estimated = gt(amount, 0) ? floor(times(amount, price)) : "0"
    const estimatedSingle = decimal(price, 3)

    /* to lp */
    const deposits = [
      { amount, pair: pairPool.asset },
      { amount: estimated, pair: pairPool.uusd },
    ]

    const toLP = calc.toLP(deposits, pairPool.total)

    /* from lp */
    const shares = {
      uusd: { amount: pairPool.uusd, token: token00 },
      asset: { amount: pairPool.asset, token: token11 },
    }

    const fromLP = calc.fromLP(amount, shares, pairPool.total)
    const assetValueFromLP = times(price, fromLP.asset.amount)
    const valueFromLP = plus(assetValueFromLP, fromLP.uusd.amount)

    return {
      toLP: {
        estimated,
        estimatedSingle,
        value: toLP,
        text: gt(estimated, 0) ? format(estimated, token2 ?? "") : "-",
      },

      fromLP: {
        ...fromLP,
        value: valueFromLP,
        text: fromLP
          ? [fromLP.uusd, fromLP.asset]
            .map(({ amount, token }) => {
              const token1Detail = findTokenDetailFn(token)
              return formatAsset(check8decOper(token) ? div(amount, 100) : amount, lookupSymbol(token1Detail?.tokenSymbol ?? ""))
            })
            .join(" + ")
          : " - ",
      },
    }
  }
}

import { gt, multiple, sum } from "../../libs/math"
import { useFetchTokens } from "../../hooks"
import { useEffect, useState } from "react"
import {
  useFindPairPoolPrice,
  useGetTokenInfoQuery, useTokenMethods,
} from "../../data/contract/info"
import { SMALLEST, UUSD } from "../../constants"
import {
  adjustAmount,
  isNative,
  lookupSymbol,
} from "../../libs/parse"
import { useFindBalance } from "../../data/contract/normalize"

export interface DATASOURCE {
  token: string
  symbol: string
  name: string
  pair?: string
  lpToken?: string
  balance: string
  price: string
  status: string
  value: string
  change: string
}

const useMyHoldings = () => {
  const { tokensListWithuusdPairs } = useFetchTokens()
  const getTokenBalanceFn = useFindBalance()
  const getTokenInfoFn = useGetTokenInfoQuery()
  const findPairPoolFn = useFindPairPoolPrice()
  const { check8decOper } = useTokenMethods()

  const dataSource: DATASOURCE[] = [...tokensListWithuusdPairs, { token: UUSD, pair: UUSD, lp: UUSD }].map((uusdItem) => {
    const { token, pair, lp } = uusdItem
    const tokenInfo = isNative(token)
      ? { name: lookupSymbol(token), symbol: lookupSymbol(token) }
      : getTokenInfoFn?.(token)
    const nonNativebal = adjustAmount(
        check8decOper(token),
        check8decOper(token),
      getTokenBalanceFn?.(token) ?? "0"
    )
    const balance = isNative(token)
      ? multiple(getTokenBalanceFn?.(token) ?? "0", SMALLEST)
      : nonNativebal ?? "0"
    const nonNativePrice = adjustAmount(
        check8decOper(token),
      !check8decOper(token),
      findPairPoolFn?.(pair, token) ?? "0"
    )
    const price = token === "uusd" ? "1" : nonNativePrice ?? "0"

    // todo update status for listed and delisted
    return {
      symbol: tokenInfo?.symbol ?? "",
      name: tokenInfo?.name ?? "",
      token: token,
      pair,
      lpToken: lp,
      balance: balance ?? "0",
      price,
      status: "LISTED",
      value: multiple(price, balance),
      change: "0",
    }
  })

  const totalValue = dataSource
    ? sum(
        dataSource
          .filter((data) => gt(data.balance, 0))
          .map(({ value }) => value && value)
      )
    : "0"

  return {
    totalValue,
    dataSource: dataSource.filter((data) => gt(data.balance, 0)),
  }
}

export default useMyHoldings

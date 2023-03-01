import { useEffect, useMemo, useState } from "react"
import { div } from "../libs/math"
import { SMALLEST, UUSD } from "../constants"
import { isNative, lookupRealSymbol, lookupSymbol } from "../libs/parse"
import {
  getTokenBalance,
  useContractsFullForm,
  useFindBalance,
  useRawPairs,
  useTokensInfo
} from "../data/contract/normalize"
import { FindNativeBalanceDetails, TokenInfo, useGetTokenInfoQuery } from "../data/contract/info"
import { useSetRecoilState } from "recoil"
import { useContractsAddress } from "./useContractsAddress"
import { setContractsPairsState } from "../data/contract/farming";
import {SelectType} from "../forms/Exchange/useSelectSwapAsset";
import {useProtocol} from "../data/contract/protocol";

interface Asset_Infos {
  token?: { contract_addr: string }
  native_token?: { denom: string }
}
enum Key {
  token1 = "token1",
}
interface Token_Amount {
  amount: string
  token: string
}

interface FinalContract {
  contract_addr: string
  denom?: string
  tokenSymbol: string
  tokenName: string
}
export interface CONTRACT {
  token: string
  pair: string
  lp: string
  denom: string
  isNative: boolean
  contract_addr: string
  tokenSymbol: string
  tokenName: string
  decimals?: number
  secondToken: string
  selectType?: SelectType
}

export interface PAIR {
  asset_infos: Asset_Infos[]
  contract_addr: string
  liquidity_token: string
}

export const useFetchTokens = (
  otherToken?: string,
  selectedToken?: any,
  showAsPairs?: boolean
): {
  contractList: CONTRACT[]
  contractPairList: PAIR[]
  listed: CONTRACT[]
  contracts: CONTRACT[]
  getSymbolFromContract: (token: string) => FinalContract
  getPair: (token1: string, token2: string) => any
  getMaxVal: (token: string, type: string) => void
  getMaxValueForNatives: (token: string, type: string) => string | undefined
  getMaxValueForNativesLp: (token: string) => string | undefined
  load: (token: string, type: string) => { token: string; amount: any }
  fetchBalanceAmount: (token: string) => { token: string; amount: any }
  getStakableLP: (lptoken: string) => { token: string; amount: any }
  ifNative: (token: string, tokenSymbol?: string) => undefined | CONTRACT
  tokensListWithuusdPairs: { token: string; pair: string; lp: string }[]
  getOtherToken: (pair: string, contract_addr: string) => undefined | CONTRACT
  getPairFromLp: (lp: string) => undefined | CONTRACT
  getWholePairFromLp: (lp: string) => undefined | PAIR
  nativeTokenBalance: (token: string | undefined) => undefined | string
  balanceAPI: (token: string) => undefined | string
  getTokensFromPair: (pair: string) => undefined | CONTRACT[]
  getTokenOrDenom: (token: string | undefined) => undefined | string
  getTokenSymbol: (token: string | undefined) => string
  token1Value: Token_Amount
  token2Value: Token_Amount
} => {

  const [listed, setList] = useState<CONTRACT[]>([])
  const [contracts, setContracts] = useState<CONTRACT[]>([])
  const [contractList, setContractList] = useState<CONTRACT[]>([])
  const [contractPairList, setContractPairList] = useState<PAIR[]>([])
  const [tokensInFo, setTokensInfo] = useState<TokenInfo[]>([])
  const [token1Value, setToken1Value] = useState<{
    amount: string
    token: string
  }>({ token: "", amount: "0" })
  const [token2Value, setToken2Value] = useState<{
    amount: string
    token: string
  }>({ token: "", amount: "0" })

  // const getTokenBalanceFn = useRecoilValue(getTokenBalance)
  const getTokenBalanceFn = useFindBalance()
  const findNativeBalanceFn = FindNativeBalanceDetails()
  // const findNativeBalanceFn = useRecoilValue(findNativeBalance)
  const setContractsPairs = useSetRecoilState(setContractsPairsState)

  const balanceAPI = (token: string) => {
    try {
      return getTokenBalanceFn?.(token) ?? "0"
    } catch (error) {
      return undefined
    }
  }

  const nativeTokenBalance = (token: string | undefined) => {
    if (!token) return undefined
    if (isNative(token)) {
      return findNativeBalanceFn(token) ?? "0"
    }
    return undefined
  }

  const fetchBalance = (item: string, type: string) => {
    // try {
    const result: any = balanceAPI(item)
    if (result) {
      if (type === Key.token1) {
        const token1Val = { token: item, amount: result ?? "0" }
        setToken1Value(token1Val)
        return token1Val
      } else {
        const token2Val = { token: item, amount: result ?? "0" }
        setToken2Value({ token: item, amount: result ?? "0" })
        return token2Val
      }
    }
    return { token: "", amount: "0" }
    /*} catch (error) {
    }*/
  }

  const fetchBalanceAmount = (item: string) => {
    // try {
    const result: any = balanceAPI(item)
    if (result) {
      return { token: item, amount: result ?? "0" }
    }
    return { token: "", amount: "0" }
    /*} catch (error) {
    }*/
  }

  const getMaxVal: any = (token: string, type: string) => {
    const ifNativeToken = ifNative(token)
    if (ifNativeToken) {

      const balance: any = findNativeBalanceFn(ifNativeToken.denom)
      if (type === Key.token1) {
        setToken1Value({
          token,
          amount: balance ? div(balance, SMALLEST) : "0",
        })
      } else {
        setToken2Value({
          token,
          amount: balance ? div(balance, SMALLEST) : "0",
        })
      }
    } else {
      // return non native token value
      return fetchBalance(token, type)
    }

    return "0"
  }

  const getStakableLP: any = (lptoken: string) => {
    const ifNativeToken = ifNative(lptoken)

    if (ifNativeToken) {
      const balance: any = findNativeBalanceFn(ifNativeToken.denom)
      return {
        token: lptoken,
        amount: balance ? div(balance.amount, SMALLEST) : "0",
      }
    }
    else {
      // return non native token value
      return fetchBalanceAmount(lptoken)
    }
  }

  const getTokenOrDenom: any = (token: string) => {
    const contract = contracts.find((contract) => contract.contract_addr === token);

    if (contract) {
      if (contract.isNative) {
        return contract.denom;
      } else {
        return token;
      }
    }
    return undefined
  }


  const getMaxValueForNatives: any = (token: string, type: string) => {
    const ifNativeToken = ifNative(token)

    if (ifNativeToken) {
      const balance: any = findNativeBalanceFn(ifNativeToken.denom)

      if (type === Key.token1) {
        return balance ? div(balance.amount, SMALLEST) : "0"
      } else {
        return balance ? div(balance.amount, SMALLEST) : "0"
      }
    } else {
      // return non native token value
      return undefined
    }
  }

  const getMaxValueForNativesLp: any = (lptoken: string) => {
    const ifNativeToken = ifNativeLp(lptoken)
    if (ifNativeToken) {
      const balance: any = findNativeBalanceFn(ifNativeToken.denom)
      return balance ? div(balance.amount, SMALLEST) : "0"
    } else {
      // return non native token value
      return "0"
    }
  }

  const rawPairs = useRawPairs()

  useEffect(() => {
    rawPairs && rawPairs.contents && !rawPairs.isLoading && setContractPairList(rawPairs.contents.pairs ?? [])
    rawPairs && rawPairs.contents && !rawPairs.isLoading && setContractsPairs(rawPairs.contents.pairs ?? [])
  }, [rawPairs])

  const useContractsFullForms = useContractsFullForm()

  useEffect(() => {
    useContractsFullForms.contents && !useContractsFullForms.isLoading && setContracts(useContractsFullForms.contents)
  }, [useContractsFullForms])

  const useTokens = useTokensInfo()
  useEffect(() => {
    useTokens && useTokens.contents && !useTokens.isLoading && setTokensInfo(useTokens.contents)
  }, [useTokens])

  const getTokenInfo = (token: string) => {
    const isPair = contracts.find((contract: CONTRACT) => {
      return contract.isNative && contract.contract_addr === token
    })
    if (isPair) {
      const tokens = contracts.filter((contract: CONTRACT) => {
        return contract.denom === isPair.denom
      })
      return { tokens, isPair }
    } else {
      const tokens = contracts.filter((contract: CONTRACT) => {
        return contract.contract_addr === token
      })
      return { tokens, isPair }
    }
  }

  useEffect(() => {
    if (otherToken === undefined) {
      const uniqueList: any = []
      //improve
      contracts.map((list: CONTRACT) => {
        const duplicat = uniqueList.find((unique: CONTRACT) => {
          return showAsPairs
            ? unique.pair === list.pair
            : unique.contract_addr === list.contract_addr
        })
        !duplicat && uniqueList.push(list)
      })
      setList(uniqueList)
    } else {
      const { tokens, isPair } = getTokenInfo(otherToken)

      const filters: CONTRACT[] = tokens.map(
        (token: CONTRACT): CONTRACT => {
          const data: any = contracts.filter((contract) => {
            if (isPair) {
              return (
                token.pair === contract.pair && contract.denom !== isPair.denom
              )
            } else {
              return (
                token.pair === contract.pair &&
                contract.contract_addr !== otherToken
              )
            }
          })
          return data
        }
      )
      filters && setList(filters.flat())
    }
  }, [contracts])
  const getTokenInfoFn = useGetTokenInfoQuery()
  // const getTokenInfoFn = useRecoilValue(getTokenInfoQuery)

  useMemo(() => {
    !contractList.length && listed.map(async (li: CONTRACT) => {
      if (li.isNative) {
        const nativeData = {
          ...li,
          tokenSymbol: lookupSymbol(li.denom),
          tokenName: lookupSymbol(li.denom),
        }
        setContractList((oldArray) => [
          ...oldArray.filter((item: CONTRACT) =>
            showAsPairs
              ? item.pair !== nativeData.pair
              : item.tokenSymbol !== nativeData.tokenSymbol
          ),
          nativeData,
        ])
      } else {

        const tokenInfo = getTokenInfoFn?.(li.contract_addr)
        if (tokenInfo) {
          const dataObj = {
            ...li,
            tokenSymbol: tokenInfo.symbol ?? "",
            tokenName: tokenInfo.name ?? "",
          }
          setContractList((oldArray) => [
            ...oldArray.filter((item: CONTRACT) =>
              showAsPairs
                ? item.pair !== dataObj.pair
                : item.tokenSymbol !== dataObj.tokenSymbol
            ),
            dataObj,
          ])
        }
      }
    })
  }, [listed])

  const getSymbolFromContract: any = (token: string) => {
    const cont = contractList.find((contract: CONTRACT) => {
      return contract.contract_addr === token
    })
    if (cont) {
      return cont
    } else {
      const native = contracts.find((contract: CONTRACT) => {
        return contract.isNative && contract.contract_addr === token
      });
      return { ...native, tokenSymbol: lookupSymbol(native?.denom) ?? "", tokenName: lookupSymbol(native?.denom) ?? "" }
    }
  }

  const { getSymbol } = useProtocol()

  const getTokenSymbol = (token: string | undefined) => {
    return getSymbol(token ?? "")
      ? getSymbol(token ?? "")
      : getSymbolFromContract(token ?? "")?.tokenSymbol
  }

  /**
   * check if token is native or not
   * @param token
   * @param tokenSymbol
   */
  const ifNative = (token: string, tokenSymbol?: string) => {
    return contracts.find((contract: CONTRACT) => {
      return contract.isNative && contract.contract_addr === token
        && (tokenSymbol && tokenSymbol?.toLowerCase()?.startsWith('u')
          ? contract.denom === lookupRealSymbol(tokenSymbol)
          : true
        )
    })
  }

  const ifNativeLp = (lp: string) => {
    return contracts.find((contract: CONTRACT) => {
      return contract.isNative && contract.lp === lp
    })
  }

  const getPair: any = (token1: string, token2?: string) => {
    const { tokens, isPair } = getTokenInfo(token1)

    const filters: CONTRACT[] =
      tokens &&
      tokens.map(
        (token: CONTRACT): CONTRACT => {
          const data: any = contracts.filter((contract) => {
            if (isPair) {
              return (
                token.pair === contract.pair && contract.denom !== isPair.denom
              )
            } else {
              return (
                token.pair === contract.pair && contract.contract_addr !== token1
              )
            }
          })
          return data
        }
      )
    const getPairVal =
      filters &&
      filters.flat().find((filter) => {
        return filter.contract_addr === token2
      })
    return { pair: getPairVal ? getPairVal?.pair : "" }
  }

  const getOtherToken = (pair: string, contract_addr: string) => {
    return contracts
      .filter((contract) => {
        return contract.pair === pair
      })
      .find((contract) => {
        return contract_addr !== contract.contract_addr
      })
  }

  const getTokensFromPair = (pair: string) => {
    return contracts
      .filter((contract) => {
        return contract.pair === pair
      })
  }

  const getPairFromLp = (lp: string) => {
    return contracts.find((contract) => {
      return contract.lp === lp
    })
  }

  const getWholePairFromLp = (lp: string) => {
    return contractPairList.find((contract) => {
      return contract.liquidity_token === lp
    })
  }

  const [tokensListWithuusdPairs, setTokensListWithuusdPairs] = useState<
    { token: string; pair: string; lp: string }[]
  >([])

  useEffect(() => {
    const tokensWithUusd =
      contractPairList &&
      contractPairList
        .filter((item) => {
          const asset_data = item.asset_infos.find((asset) => {
            return (
              asset.native_token !== undefined &&
              asset.native_token.denom === UUSD
            )
          })

          return (
            asset_data && {
              pair: item.contract_addr,
              lp: item.liquidity_token,
              asset_infos: item.asset_infos,
            }
          )
        })
        .map((item) => {
          const asset_data = item.asset_infos.find((asset) => {
            return asset.native_token?.denom !== 'uusd'
          })

          return {
            pair: item.contract_addr,
            lp: item.liquidity_token,
            token: (asset_data && (asset_data?.token ? asset_data.token?.contract_addr : asset_data.native_token?.denom)) ?? "",
          }
        })

    setTokensListWithuusdPairs(tokensWithUusd)
  }, [contractPairList])

  return {
    contractList: contractList !== undefined ? contractList : [],
    contractPairList,
    listed,
    contracts,
    getMaxVal,
    token1Value,
    token2Value,
    getSymbolFromContract,
    getPair,
    ifNative,
    getOtherToken,
    getPairFromLp,
    tokensListWithuusdPairs,
    getWholePairFromLp,
    getMaxValueForNatives,
    getMaxValueForNativesLp,
    load: fetchBalance,
    fetchBalanceAmount,
    nativeTokenBalance,
    balanceAPI,
    getStakableLP,
    getTokensFromPair,
    getTokenOrDenom,
    getTokenSymbol
  }
}

import { useEffect, useState } from "react"
import { Dictionary } from "ramda"
import { UUSD } from "../constants"
import createContext from "./createContext"
import {lookupSymbol} from "../libs/parse"
import useNetwork from "./useNetwork";

interface ContractAddressJSON {
  /** Contract addresses */
  contracts: Dictionary<string>
  /** Token addresses */
  whitelist: Dictionary<ListedItem>
}

interface ContractAddressHelpers {
  /** Array of listed item */
  listed: ListedItem[]
  listedAll: ListedItem[]
  /** Find token with symbol */
  getToken: (symbol?: string) => string
  getUstPair: (token?: string) => string | undefined
  /** Find token with name */
  getName: (symbol?: string) => string
  /** Find symbol with token */
  getSymbol: (token?: string) => string
  /** Convert structure for chain */
  toAssetInfo: (token: string) => AssetInfo | NativeInfo
  toToken: (params: Asset) => Token
  toPlainString: (num: string) => string
  /** Convert from token of structure for chain */
  parseToken: (token: AssetToken | NativeToken) => Asset
}

export type ContractsAddress = ContractAddressJSON & ContractAddressHelpers
const context = createContext<ContractsAddress>("useContractsAddress")
export const [useContractsAddress, ContractsAddressProvider] = context

/* state */
export const useContractsAddressState = (): ContractsAddress | undefined => {
  const { contract: url } = useNetwork()
  const [data, setData] = useState<ContractAddressJSON>()

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(url)
        const json: ContractAddressJSON = await response.json()
        setData(json)
      } catch {
        setData({ contracts: {}, whitelist: {} })
      }
    }

    url && load()
  }, [url])

  const helpers = ({
    whitelist,
  }: ContractAddressJSON): ContractAddressHelpers => {
    const listedAll = Object.values(whitelist)
    const listed = listedAll.filter(({ status }) => status === "LISTED")

    const getToken = (symbol?: string) =>
      !symbol
        ? ""
        : symbol === UUSD
        ? symbol
        : listed.find((item) => item.symbol === symbol)?.["token"] ?? ""

    const getSymbol = (token?: string) =>
      !token
        ? ""
        : token.startsWith("u")
        ? lookupSymbol(token)
        : whitelist[token]?.["symbol"] ?? ""

    const getUstPair = (token?: string) =>
        !token
            ? undefined
                : whitelist[token]?.["pair"] ?? undefined

    const getName = (token?: string) =>
      !token
        ? ""
        : token.startsWith("u")
        ? token
        : whitelist[token]?.["name"] ?? ""

    const toAssetInfo = (token: string) =>
      token === UUSD
        ? { native_token: { denom: token } }
        : { token: { contract_addr: token } }

    const toToken = ({ amount, token }: Asset) => ({
      amount,
      info: toAssetInfo(token),
    })

    const toPlainString = (num: any) => {
      if (Math.abs(num) < 1.0) {
        const e = parseInt(num.toString().split("e-")[1])
        if (e) {
          num *= Math.pow(10, e - 1)
          num = "0." + new Array(e).join("0") + num.toString().substring(2)
        }
      } else {
        let e = parseInt(num.toString().split("+")[1])
        if (e > 20) {
          e -= 20
          num /= Math.pow(10, e)
          num += new Array(e + 1).join("0")
        }
      }
      return num
    }

    const parseAssetInfo = (info: AssetInfo | NativeInfo) => {
      const token =
        "native_token" in info
          ? info?.native_token.denom
          : info.token.contract_addr

      return { token, symbol: getSymbol(token) }
    }

    const parseToken = ({ amount, info }: AssetToken | NativeToken) => ({
      amount,
      ...parseAssetInfo(info),
    })
    // @ts-ignore
    return {
      listed,
      listedAll,
      getToken,
      getSymbol,
      toAssetInfo,
      toToken,
      parseToken,
      getName,
      toPlainString,
      getUstPair
    }
  }

  return data && { ...data, ...helpers(data) }
}

import { atom, selector, useRecoilValue } from "recoil"
import axios from "axios"
import { getIsTokenNative } from "../../libs/parse"
import { BalanceKeyRecoil, PriceKeyRecoil } from "../../hooks/contractKeys"
import { networkQuery } from "../network"
import { useStore } from "../utils/loadable"

const protocolAddressQuery = selector({
  key: "protocolAddress",
  get: async ({ get }) => {
    const { contract: url } = get(networkQuery)

    try {
      const { data } = await axios.get<ProtocolJSON>(url)
      return data
    } catch {
      throw new Error(`Failed to load contract: ${url}`)
    }
  },
})

const protocolHelpersQuery = selector({
  key: "protocolHelpers",
  get: ({ get }) => {
    const { whitelist } = get(protocolAddressQuery)

    const listedAll = Object.values(whitelist)
    const listed = listedAll.filter(({ status }) => status !== "DELISTED")

    // @ts-ignore
    const getToken  = (symbol?: string) =>
      !symbol
        ? ""
        : getIsTokenNative(symbol)
          ? symbol ?? ''
          : [...listed].find(
            (item) => item.symbol === symbol
          )?.["token"] ?? ""

    const getSymbol = (token?: string) =>
      !token
        ? ""
        : getIsTokenNative(token)
          ? token
          : { ...whitelist }[token]?.symbol ?? ""

    const getPriceKey = (key: PriceKeyRecoil, token: string) =>
      getIsTokenNative(token)
        ? PriceKeyRecoil.NATIVE
        : getIsDelisted(token)
          ? PriceKeyRecoil.END
          : key === PriceKeyRecoil.ORACLE
            ? getIsPreIPO(key)
              ? PriceKeyRecoil.PRE
              : key
            : key

    const getBalanceKey = (token: string) =>
      getIsTokenNative(token)
        ? BalanceKeyRecoil.NATIVE
        : BalanceKeyRecoil.TOKEN

    const getIsDelisted = (token: string) =>
      whitelist[token]?.status === "DELISTED"

    const getIsPreIPO = (token: string) =>
      whitelist[token]?.status === "PRE_IPO"

    const getPair = (token: string) =>
      whitelist[token]?.pair

    const toAssetInfo = (token: string) =>
      getIsTokenNative(token)
        ? { native_token: { denom: token } }
        : { token: { contract_addr: token } }

    const toToken = ({ amount, token }: Asset) => ({
      amount,
      info: toAssetInfo(token),
    })

    const parseAssetInfo = (info: AssetInfo | NativeInfo) => {
      const token =
        "native_token" in info
          ? info.native_token.denom
          : info.token.contract_addr

      return { token, symbol: getSymbol(token) }
    }

    const parseToken = ({ amount, info }: AssetToken | NativeToken) => ({
      amount,
      ...parseAssetInfo(info),
    })

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

    return {
      listed,
      listedAll,

      getToken,
      getPair,
      getSymbol,

      getPriceKey,
      getBalanceKey,

      getIsDelisted,
      getIsPreIPO,

      toAssetInfo,
      parseAssetInfo,

      toToken,
      parseToken,
      getUstPair,
      getName,
      toPlainString
    }
  },
})

export const protocolQuery = selector({
  key: "protocol",
  get: ({ get }) => {
    return ({
      ...get(protocolAddressQuery),
      ...get(protocolHelpersQuery),
    })
  },
})

export const useProtocol = () => {
  return useRecoilValue(protocolQuery)
}

const protocolQueryState = atom<any>({
  key: "protocolQueryState",
  default: {},
})


export const useProtocolQuery = () => {
  return useStore(protocolQuery, protocolQueryState)
}

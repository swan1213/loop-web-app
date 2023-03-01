import { useEffect, useState } from "react"
import { useFetchTokens } from "../useTradeAssets"
import { lookupSymbol } from "../../libs/parse"
import {useRecoilValue, useSetRecoilState} from "recoil";
import {setFarmingListState, setFarmingListV2State} from "../../data/contract/farming";
import {findLpTokenInfo, useFindLpTokenInfo} from "../../data/contract/normalize";

export interface LIST {
  token: string
  symbol: string
  lpToken: string
  contract_addr: string
  tokens?: Info[]
}
export interface List {
  token: string
  symbol: string
  lpToken: string
  contract_addr: string
}

export interface Info {
  token?: { contract_addr: string }
  native_token?: { denom: string }
}

export const useFarmingList = (): LIST[] => {
  const { contractPairList } = useFetchTokens(undefined)
  const [list, setList] = useState<List[]>([])
  const setFarmingList = useSetRecoilState(setFarmingListState)
  const getTokenSymbol = useRecoilValue(findLpTokenInfo);

  useEffect(() => {
    const sortContractList = contractPairList.map(
      (contractPair: {
        asset_infos: Info[]
        contract_addr: string
        liquidity_token: string

      }) => {
        const pairs = contractPair.asset_infos.map((info) => {
          if (info?.native_token !== undefined) {
            return {
              token: lookupSymbol(info.native_token.denom),
              symbol: lookupSymbol(info.native_token.denom),
            }
          } else {
            const symbol = getTokenSymbol(info.token?.contract_addr)?.symbol ?? ""
            return { token: info.token?.contract_addr, symbol: lookupSymbol(symbol) }
          }
        })
        return {
          tokens: contractPair.asset_infos,
          token: contractPair.liquidity_token,
          symbol: pairs.map((pair) => pair.symbol).join(" - "),
          lpToken: contractPair.liquidity_token,
          contract_addr: contractPair.contract_addr,
        }
      }
    )
    setList(sortContractList)
    setFarmingList(sortContractList)
  }, [contractPairList])
  return list
}


export const useFarming2List = (): LIST[] => {
  const { contractPairList } = useFetchTokens(undefined)
  const [list, setList] = useState<List[]>([])
  const setFarmingList = useSetRecoilState(setFarmingListV2State)
  const getTokenSymbol = useRecoilValue(findLpTokenInfo);

  useEffect(() => {
    const sortContractList = contractPairList.map(
        (contractPair: {
          asset_infos: Info[]
          contract_addr: string
          liquidity_token: string

        }) => {
          const pairs = contractPair.asset_infos.map((info) => {
            if (info?.native_token !== undefined) {
              return {
                token: lookupSymbol(info.native_token.denom),
                symbol: lookupSymbol(info.native_token.denom),
              }
            } else {
              const symbol = getTokenSymbol(info.token?.contract_addr)?.symbol ?? ""

              return { token: info.token?.contract_addr, symbol }
            }
          })
          return {
            tokens: contractPair.asset_infos,
            token: contractPair.liquidity_token,
            symbol: pairs.map((pair) => pair.symbol).join(" - "),
            lpToken: contractPair.liquidity_token,
            contract_addr: contractPair.contract_addr,
          }
        }
    )
    setList(sortContractList)
    setFarmingList(sortContractList)
  }, [contractPairList])
  return list
}

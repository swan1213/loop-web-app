import { selector, selectorFamily } from "recoil"
import { request } from "graphql-request"
import { RequestDocument } from "graphql-request/dist/types"
import alias, { getVolumeByPairAlias, tradeQueryAlias } from "../contract/alias"
import { locationKeyState } from "../app"
import { mantleURLQuery, statsURLQuery } from "../network"
import {parseResult, parseResults} from "./parse"
import { contractsQuery, getLoopPairsQuery } from "../contract/contract"
import {
  GetPairsDocument, GetPairTVLDocument,
  GetQueryTradeDocument,
  GetTokenInfoDocument,
  GetVolumeByPairDocument
} from "../../types/contract"
import {setContractsPairsState} from "../contract/farming";
import { PairTVLQuery } from "../../statistics/gqldocs";
import {getContractQueryQuery} from "./query";

export interface PairTVL {
  [index:string]: { token: string, second_token: string, liquidity: string}
}

export const LUNA: ListedItem = {
  token: "uluna",
  symbol: "Luna",
  name: "Luna",
  pair: "",
  lpToken: "",
  status: "LISTED",
}

/* queries */
export const getTokensContractQueriesQuery = selectorFamily({
  key: "getTokensContractQueries",
  get:
      (tokens: string[]) =>
          ({ get }) => {
            const getContractQueries = get(getContractQueriesQuery)

            return async <Parsed>(
                fn: (token: string) => ContractVariables,
                name: string
            ) => {
              const document = alias(
                  tokens.map((token) => ({ name: token, ...fn(token) })),
                  name
              )

              return await getContractQueries<Parsed>(document, name)
            }
          },
})

export const getListedContractQueriesQuery = selector({
  key: "getListedContractQueries",
  get: ({ get }) => {
    const contracts  = get(contractsQuery)
    /*const getContractQueries = get(getContractQueryQuery)
    return async <Parsed>(fn: GetTokenInfoDocument, name?: string) => {
      const document =  contracts ? contracts
          .filter((item) => !item.isNative)
          .filter((item) => fn(item))
          .map((item) => ({ name: item.contract_addr, ...fn(item) })) : []

      const list  = await document.map(async (doc) => {
        //@ts-ignore
        const item =  await getContractQueries<Parsed>({ contract: doc.contract, msg: doc.msg}, name)
        return doc.name ? { ...item, token: doc.name } : item
      })
      const dataList:any =  await Promise.all(list)
      return  dataList ? dataList.reduce((acc, item) => ({ ...acc, [item.token]: item}), {}) : {}
    }*/
    const getContractQueries = get(getContractQueriesQuery)
      return async <Parsed>(fn: GetTokenInfoDocument, name: string) => {
        const document = alias(
          contracts ? contracts
            .filter((item) => !item.isNative)
            .filter((item) => fn(item))
            .map((item) => ({ name: item.contract_addr, ...fn(item) })) : [],
          name
        )

        return await getContractQueries<Parsed>(document, name)
      }
  },
})

export const getListedLpContractQueriesQuery = selector({
  key: "getListedLpContractQueries",
  get: ({ get }) => {
    const contracts  = get(contractsQuery)

    /*const getContractQueries = get(getContractQueryQuery)
    return async <Parsed>(fn: GetTokenInfoDocument, name?: string) => {
      const document =  contracts ? contracts
          .filter((item) => fn(item))
          .map((item) => ({ name: item.lp, ...fn(item) })) : []
      const list  = await document.map(async (doc) => {
        //@ts-ignore
        const item =  await getContractQueries<Parsed>({ contract: doc.contract, msg: doc.msg}, name)
        return doc.name ? { ...item, token: doc.name } : item
      })
      const dataList:any =  await Promise.all(list)
      return  dataList ? dataList.reduce((acc, item) => ({ ...acc, [item.token]: item}), {}) : {}
    }*/
    const getContractQueries = get(getContractQueriesQuery)
    return async <Parsed>(fn: GetTokenInfoDocument, name: string) => {
      const document = alias(
        contracts ? contracts
          // .filter((item) => !item.isNative)
          .filter((item) => fn(item))
          .map((item) => ({ name: item.lp, ...fn(item) })) : [],
        name
      )

      return await getContractQueries<Parsed>(document, name)
    }
  },
})

export const getTerraListedContractQueriesQuery = selector({
  key: "getTerraListedContractQueries",
  get: ({ get }) => {
    const contracts  = get(contractsQuery)

    const getContractQueries = get(getContractQueriesQuery)
    if(contracts) {
      /*return async <Parsed>(fn: GetTokenInfoDocument, name?: string) => {
        const document =  contracts
            .filter((item) => !item.isNative)
            .filter((item) => fn(item))
            .map((item) => ({ name: item.contract_addr, ...fn(item) }))
        const list  = await document.map(async (doc) => {
          //@ts-ignore
          const item =  await getContractQueries<Parsed>({ contract: doc.contract, msg: doc.msg}, doc.name)
          return doc.name ? { ...item, token: doc.name } : item
        })
        const dataList:any =  await Promise.all(list)
        return  dataList ? dataList.reduce((acc, item) => ({ ...acc, [item.token]: item}), {}) : {}

      }*/
      return async <Parsed>(fn: GetTokenInfoDocument, name: string) => {
        const document = alias(
            contracts
                .filter((item) => !item.isNative)
                .filter((item) => fn(item))
                .map((item) => ({ name: item.contract_addr, ...fn(item) })),
            name
        )

        return await getContractQueries<Parsed>(document, name)
      }
    }
  },
})

export const getMantleGraphQuery = selector({
  key: "getMantleGraphQuery",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(mantleURLQuery)

    return async <Parsed>(document: RequestDocument, name: string) => {
      try {
        const result = await request<any>(
            url + "?" + name,
            document
        )

        return result ? parseResults<Parsed>(result) : undefined
      } catch (error) {
        const result = (error.response && error.response.data !== undefined) ? error.response.data : undefined
        return result ? parseResults<Parsed>(result) : undefined
      }
    }
  },
})

export const getContractQueriesQuery = selector({
  key: "getContractQueries",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(mantleURLQuery)

    return async <Parsed>(document: RequestDocument, name: string) => {
      try {
        const result = await request<Dictionary<ContractData | null> | null>(
            url + "?" + name,
            document
        )

        return result ? parseResults<Parsed>(result) : undefined
      } catch (error) {
        const result = (error.response && error.response.data !== undefined) ? error.response.data : undefined
        return result ? parseResults<Parsed>(result) : undefined
      }
    }
  },
})

export const getPairsContractQueriesQuery = selector({
  key: "getPairsContractQueriesQuery",
  get: ({ get }) => {
    const contracts  = get(getLoopPairsQuery)

    /*const getContractQueries = get(getContractQueryQuery)
    if(contracts) {
      return async <Parsed>(fn: GetPairsDocument, name?: string) => {
        const document =  contracts ? contracts
            .filter((item) => fn(item))
            .map((item) => ({ name: item, ...fn(item) })) : []
        const list  = await document.map(async (doc) => {
          //@ts-ignore
          const item =  await getContractQueries<Parsed>({ contract: doc.contract, msg: doc.msg}, name)
          return doc.name ? { ...item, token: doc.name } : item
        })
        const dataList:any =  await Promise.all(list)
        return  dataList ? dataList.reduce((acc, item) => ({ ...acc, [item.token]: item}), {}) : {}
      }
    }*/
    const getContractQueries = get(getContractQueriesQuery)
    return async <Parsed>(fn: GetPairsDocument, name: string) => {
      const document = alias(
        contracts ? contracts
          .filter((item) => fn(item))
          .map((item) => ({ name: item, ...fn(item) })) : [],
        name
      )

      return await getContractQueries<Parsed>(document, name)
    }
  },
})
// pool


export const getLoopGraphQueriesQuery = selector({
  key: "getLoopGraphQueries",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(statsURLQuery)

    return async <Parsed>(document: RequestDocument, name: string) => {
      try {
        const result = await request<Dictionary<TradeQuery | null> | null>(
            url + "?" + name,
            document
        )
        return result ? result : undefined
      } catch (error) {
        const result = error.response.data
        return result ? JSON.parse(result) as Parsed : undefined
      }
    }
  },
})

export const getPairTVL = selector({
  key: "getPairTVL",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(statsURLQuery)

    return async <Parsed>(document: RequestDocument, name: string) => {
      try {
        const result = await request<Dictionary<PairTVL | null> | null>(
            url + "?" + name,
            document
        )
        return result ? result : undefined
      } catch (error) {
        const result = error.response.data
        return result ? JSON.parse(result) as Parsed : undefined
      }
    }
  },
})


export const getVolumeByPairQueries = selector({
  key: "getVolumeByPairQueries",
  get: ({ get }) => {
    const url = get(statsURLQuery)

    return async <Parsed>(document: RequestDocument, name: string) => {
      try {
        const result = await request<Dictionary<VolumeByPairQuery | null> | null>(
            url + "?" + name,
            document
        )
        return result ? result : undefined
      } catch (error) {
        const result = error.response.data
        return result ? JSON.parse(result) as Parsed : undefined
      }
    }
  },
})


export const getListedContractTradeQueriesQuery = selector({
  key: "getListedContractTradeQueriesQuery",
  get: ({ get }) => {
    const contracts  = get(contractsQuery)

    const getContractQueries = get(getLoopGraphQueriesQuery)
    return async <Parsed>(fn: GetQueryTradeDocument, name: string) => {
      const document = tradeQueryAlias(
          contracts ? contracts
              .filter((item) => !item.isNative)
              .map((item) => {
                const fres = fn(item)
                return ({ name: item.contract_addr ?? "", second_token: fres?.second_token ?? "", contract_addr: fres?.contract_addr ?? "" })
              }) : [],
          name
      )
      return await getContractQueries<Parsed>(document, name)
    }
  },
})


export const getVolumeByPairQueriesQuery = selector({
  key: "getVolumeByPairQueriesQuery",
  get: ({ get }) => {
    const contracts  = get(contractsQuery)

    const getContractQueries = get(getVolumeByPairQueries)
    return async <Parsed>(fn: GetVolumeByPairDocument, name: string) => {
      const document = getVolumeByPairAlias(
          contracts ? contracts
              .map((item) => {
                const fres = fn(item)
                return ({ contract: fres?.contract ?? "", name: fres?.contract ?? "" })
              }) : [],
          name
      )
      return await getContractQueries<Parsed>(document, name)
    }
  },
})

export const getPairTVLContracts = selector({
  key: "getPairTVLContracts",
  get: ({ get }) => {
    const list  = get(setContractsPairsState)

    const getContractQueries = get(getPairTVL)
    return async <Parsed>(fn: GetPairTVLDocument, name: string) => {
      const document = PairTVLQuery(
          list ? list
              .filter((item) => fn(item))
              .map((item) => ({...fn(item) })) : []
      )

      return await getContractQueries<Parsed>(document, name)
    }
  },
})
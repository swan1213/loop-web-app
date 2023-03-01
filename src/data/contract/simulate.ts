import {atom, selector, selectorFamily} from "recoil"
import { protocolQuery } from "./protocol"
import { getContractQueryQuery } from "../utils/query"
import {getContractQueriesQuery, getLoopGraphQueriesQuery, getMantleGraphQuery} from "../utils/queries";
// import {assetPriceHistory, ASSETPRICEHISTORY, PairTVLQuery} from "../../statistics/gqldocs";
// import {PriceHistory} from "../../containers/PriceChart";
import {TAX} from "../../graphql/gqldocs";
// import {gql} from "@apollo/client";
import {useStore} from "../utils/loadable";

interface Params {
  pair: string
  token: string
  amount: string
  reverse: boolean
}

export interface SimulatedData {
  return_amount: string
  offer_amount: string
  commission_amount: string
  spread_amount: string
}

export const pairSimulateQuery = selector({
  key: "pairSimulate",
  get: ({ get }) => {
    const { toToken } = get(protocolQuery)
    const getContractQuery = get(getContractQueryQuery)

    return async (params: Params) => {
      const { pair, token, amount, reverse } = params
      return await getContractQuery<SimulatedData>(
        {
          contract: pair,
          msg: !reverse
            ? { simulation: { offer_asset: toToken({ token, amount }) } }
            : { reverse_simulation: { ask_asset: toToken({ token, amount }) } },
        },
        "pairSimulate"
      )
    }
  },
})

/*export const getTradeHistoryQuery = selectorFamily({
  key: "getTradeHistoryQuery",
  get: (parm:PriceHistory) => async ({ get }) => {
    const getGraphQuery = get(getLoopGraphQueriesQuery)
    const document = assetPriceHistory({...parm})

    return await getGraphQuery(document, "getTradePriceHistory")
    }
})*/

const getTaxState = atom<any>({
  key: "getTaxState",
  default: undefined,
})

export const getTaxQuery = selector({
  key: "getTaxQuery",
  get: async ({ get }) => {
    const getGraphQuery = get(getMantleGraphQuery)
    return await getGraphQuery<any>(TAX, "getTaxQuery")
    }
})

export const useTaxQuery = () => {
  const data =  useStore(getTaxQuery, getTaxState)
  return data.contents
}
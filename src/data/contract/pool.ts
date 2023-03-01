import { atom, selector } from "recoil"
import { useStore } from "../utils/loadable"
import {
  getListedContractTradeQueriesQuery
} from "../utils/queries"

export const twentyHourNWeekUstTradeQuery = selector({
  key: "twentyHourNWeekUstTradeQuery",
  get: async ({ get }) => {
    const getListedContractQueries = get(getListedContractTradeQueriesQuery)
    return await getListedContractQueries<TradeTwenty7days | undefined>(
      ({ contract_addr }: { contract_addr?: string }) => ({ contract_addr: contract_addr ?? "", second_token: 'uusd' }),
      "twentyHourNWeekUstTradeQuery");
  },
})

const twentyHourNWeekUstTradeQueryState = atom<any>({
  key: "twentyHourNWeekUstTradeQueryState",
  default: undefined,
})

export const useTwentyHourNWeekUstTradeQuery = () => {
  return useStore(twentyHourNWeekUstTradeQuery, twentyHourNWeekUstTradeQueryState)
}

// export const usetwentyHourNWeekUstTradeQuery = () => {
//   const getListedContractQueries = useGetListedContractTradeQueriesQuery()
//   // return getListedContractQueries<TradeTwenty7days | undefined>(
//   //   ({ contract_addr }: { contract_addr?: string }) => ({ contract_addr: contract_addr ?? "", second_token: 'uusd' }),
//   //   "twentyHourNWeekUstTradeQuery");
// }
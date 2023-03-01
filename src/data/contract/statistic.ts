import {atom, selector} from "recoil"
import {priceKeyIndexState} from "../app"
import {getLoopGraphQueriesQuery, getVolumeByPairQueriesQuery} from "../utils/queries"
import {plus} from "../../libs/math";
import {useStore, useStoreLoadable} from "../utils/loadable"
import {contractsQuery, findTokenByPair} from "./contract";
import {GetQuerySevenDayFeeDocument} from "../../types/contract";
import {QuerySevenDayFee} from "./alias";
import {gql} from "graphql-request";
import axios from "axios";

export const getVolumeByPairQuery = selector({
  key: "getVolumeByPairQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const getListedContractQueries = get(getVolumeByPairQueriesQuery)
    return await getListedContractQueries<VolumeByPair | undefined>(
      ({ pair }: { pair: string }) => ({ contract: pair }),
      "getVolumeByPairQuery"
    )
  },
})

// get total volume methods
export const getTotalVolumeByPairQuery = selector({
  key: "getTotalVolumeByPairQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const getListedContractQueries = get(getVolumeByPairQueriesQuery)
    return await getListedContractQueries<VolumeByPair | undefined>(
      ({ pair }: { pair: string }) => ({ contract: pair }),
      "getTotalVolumeByPairQuery"
    )
  },
})

const getTotalVolumeByPairState = atom<any>({
  key: "getTotalVolumeByPairState",
  default: {},
})


export const useTotalVolumeByPair = () => {
  return useStore(getTotalVolumeByPairQuery, getTotalVolumeByPairState)
}

export const useTotalVolume = () => {
  const getTotalVolumeByPairs = useTotalVolumeByPair()
  let total = "0";
  getTotalVolumeByPairs.contents && Object.keys(getTotalVolumeByPairs.contents).map(async (index) => {
    total = plus(total, getTotalVolumeByPairs.contents[index] ?? "0")
  })
  return total;
}


const getSevenDayFeeState = atom<any>({
  key: "getSevenDayFeeState",
  default: [],
})

export const useSevenDayFee = () => {
  return useStore(sevenDayFeeQuery, getSevenDayFeeState)
}

export const useFindSevenDayFee = () => {
  const {contents}  = useSevenDayFee()
  return (pair: string) => pair ? contents[pair] : "0"
}

export const sevenDayFeeQuery = selector({
  key: "sevenDayFeeQuery",
  get: async ({ get }) => {
    get(priceKeyIndexState)
    const getListedContractQueries = get(getListedPairForSevenDayFee)
    return await getListedContractQueries<string | undefined>(
        (pair: string, token?: string, secondToken?: string) => ({ name: pair, token: token ?? "", second_token: secondToken ?? "" }),
        "sevenDayFeeQuery");
  },
})

export const findSevenDayFeeQuery = selector({
  key: "findSevenDayFeeQuery",
  get: async ({ get }) => {
    const sevenDayFee = await get(sevenDayFeeQuery)
    return (pair: string) => pair ? sevenDayFee?.[pair] : "0"
  },
})

export const getListedPairForSevenDayFee = selector({
  key: "getListedPairForSevenDayFee",
  get: ({ get }) => {
    const contracts  = get(contractsQuery)
    const findTokens  = get(findTokenByPair)
    const getContractQueries = get(getLoopGraphQueriesQuery)
    return async <Parsed>(fn: GetQuerySevenDayFeeDocument, name: string) => {
      const document = sevenDayFeeQueryAlias(
          contracts ? contracts
              .filter((item) => item.token !== 'uusd')
              .map((item) => {
                const tokens = findTokens(item.pair)
                const t1 = tokens?.[0].contract_addr
                const t2 = tokens?.[1].contract_addr
                return fn(item.pair, t1, t2)
              }) : [],
          name
      )
      return await getContractQueries<Parsed>(document, name)
    }
  },
})

export const sevenDayFeeQueryAlias = (queries: ({ name: string; token: string; second_token: string } | undefined)[], name: string) => gql`
  query ${name} {
    ${queries.map(getDocumentForSevenDayFeeQuery)}
  }
`

const getDocumentForSevenDayFeeQuery = ({ name, token, second_token }: any) =>
    !token
        ? ``
        : `
    ${name}: sevenDayPairFee(
      token: "${token}",
      second_token: "${second_token}"
    )`


    export const getCirMarketCap = selector({
      key: "getCirMarketCap",
      get: async ({ get }) => {
        get(priceKeyIndexState)
        const res= await axios({
          headers: {
          },
          method: "GET",
          url: `https://loop-api.loop.markets/v1/contracts/circulating-supply`,
        });
        return res;
      },
    })
import { atom, selector, selectorFamily } from "recoil"
import { protocolQuery } from "../contract/protocol"
import { getContractQueryQuery } from "../utils/query"
import { DPH, HALO, LOOP, LOOPR, LUV } from "../../constants"
import { useStoreLoadable } from "../utils/loadable"
import { FarmContractTYpe } from "./FarmV2"

export const getDistributeableBalanceOfLOOP = selectorFamily({
  key: "getDistributeableBalanceOfLOOP",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      const { getToken } = get(protocolQuery)
      return await getContractQuery<string | undefined>(
        {
          contract: contracts[type] ?? "",
          msg: {
            query_get_distributeable_token_balance: {
              dist_token_addr: getToken(LOOP),
            },
          },
        },
        "getDistributeableBalanceOfLOOP"
      )
    },
})

export const getDistributeableBalanceOfLUV = selectorFamily({
  key: "getDistributeableBalanceOfLUV",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      const { getToken } = get(protocolQuery)
      return await getContractQuery<string | undefined>(
        {
          contract: contracts[type] ?? "",
          msg: {
            query_get_distributeable_token_balance: {
              dist_token_addr: getToken(LUV),
            },
          },
        },
        "getDistributeableBalanceOfLUV"
      )
    },
})

const useDistributeableBalanceOfLOOPState = atom<any>({
  key: "useDistributeableBalanceOfLOOPState",
  default: [],
})
const useDistributeableBalanceOfLOOPState3 = atom<any>({
  key: "useDistributeableBalanceOfLOOPState3",
  default: [],
})
const useDistributeableBalanceOfLUVState3 = atom<any>({
  key: "useDistributeableBalanceOfLUVState3",
  default: [],
})
export const useDistributeableBalanceOfLOOP = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    getDistributeableBalanceOfLOOP(type),
    useDistributeableBalanceOfLOOPState
  )
}
export const useDistributeableBalanceOfLOOP3 = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    getDistributeableBalanceOfLOOP(type),
    useDistributeableBalanceOfLOOPState3
  )
}

export const useDistributeableBalanceOfLUV3 = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    getDistributeableBalanceOfLUV(type),
    useDistributeableBalanceOfLUVState3
  )
}


export const getDistributeableBalanceOfLOOPR = selectorFamily({
  key: "getDistributeableBalanceOfLOOPR",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      const { getToken } = get(protocolQuery)
      return await getContractQuery<string | undefined>(
        {
          contract: contracts[type] ?? "",
          msg: {
            query_get_distributeable_token_balance: {
              dist_token_addr: getToken(LOOPR),
            },
          },
        },
        "getDistributeableBalanceOfLOOPR"
      )
    },
})

export const getDistributeableBalanceOfHALO = selectorFamily({
  key: "getDistributeableBalanceOfHALO",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      const { getToken } = get(protocolQuery)
      return await getContractQuery<string | undefined>(
        {
          contract: contracts[type] ?? "",
          msg: {
            query_get_distributeable_token_balance: {
              dist_token_addr: getToken(HALO),
            },
          },
        },
        "getDistributeableBalanceOfHALO"
      )
    },
})

export const getDistributeableBalanceOfDPH = selectorFamily({
  key: "getDistributeableBalanceOfDPH",
  get:
    (type: FarmContractTYpe) =>
    async ({ get }) => {
      const { contracts } = get(protocolQuery)
      const getContractQuery = get(getContractQueryQuery)
      const { getToken } = get(protocolQuery)
      return await getContractQuery<string | undefined>(
        {
          contract: contracts[type] ?? "",
          msg: {
            query_get_distributeable_token_balance: {
              dist_token_addr: getToken(DPH),
            },
          },
        },
        "getDistributeableBalanceOfDPH"
      )
    },
})

const useDistributeableBalanceOfLOOPRState = atom<any>({
  key: "useDistributeableBalanceOfLOOPRState",
  default: [],
})

const useDistributeableBalanceOfHALOState = atom<any>({
  key: "useDistributeableBalanceOfHALOState",
  default: [],
})

const useDistributeableBalanceOfDPHState = atom<any>({
  key: "useDistributeableBalanceOfDPHState",
  default: [],
})

export const useDistributeableBalanceOfLOOPR = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    getDistributeableBalanceOfLOOPR(type),
    useDistributeableBalanceOfLOOPRState
  )
}
export const useDistributeableBalanceOfHALO = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    getDistributeableBalanceOfHALO(type),
    useDistributeableBalanceOfHALOState
  )
}

export const useDistributeableBalanceOfDPH = (type: FarmContractTYpe) => {
  return useStoreLoadable(
    getDistributeableBalanceOfDPH(type),
    useDistributeableBalanceOfDPHState
  )
}

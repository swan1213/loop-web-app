import { selector } from "recoil"
import { request } from "graphql-request"
import { RequestDocument, Variables } from "graphql-request/dist/types"
import { locationKeyState } from "../app"
import {LCDURLQuery, mantleURLQuery} from "../network"
import {parseRes, parseResult, parseResults} from "./parse"
// import {toQueryMsg} from "../../graphql/useURL"
import {WasmResponse} from "../../types/contract";
import {WASM} from "../native/gqldocs";
import {WASMQUERY} from "../../constants";

/* native */
export const getNativeQueryQuery = selector({
  key: "getNativeQuery",
  get: ({ get }) => {
    get(locationKeyState)
    const url = get(mantleURLQuery)

    return async <Parsed>(
        params: { document: RequestDocument; variables?: Variables },
        name: string
    ) => {
      const { document, variables } = params
      return await request<Parsed>(url + "?" + name, document, variables)
    }
  },
})

/* query */
export const getContractQueryQuery = selector({
  key: "getContractQuery",
  get: ({ get }) => {
    get(locationKeyState)
    // const url = get(LCDURLQuery)
    const url = get(mantleURLQuery)

    /*return async <Parsed>(variables: ContractVariables, name: string) => {
      // const document = getDocument(variables)
      try {
        const query_msg = typeof variables.msg === "string"
                ? toQueryMsg(variables.msg)
                : encodeURIComponent(JSON.stringify(variables.msg))
        const link =  `${url}/wasm/contracts/${variables.contract}/store?name=${name}&query_msg=${query_msg}`
        const response = await fetch(link)
        const result = await response.json()
        //@ts-ignore
        return parseRes<Parsed>(result)
      }catch (error) {
        // const result = (error.response && error.response.data !== undefined) ? error.response.data : undefined
        // return result ? parseResults<Parsed>(result) : undefined
        return undefined
      }

      // return result ? parseResult<Parsed>(result) : undefined
      /!*const result = await request<WasmResponse>(
          url,
          document.msg
      )
      return parseResult<Parsed>(result[WASMQUERY])*!/
    }*/
    return async <Parsed>(variables: ContractVariables, name: string) => {
      const document = getDocument(variables)

      const result = await request<WasmResponse>(
        url + "?" + name,
        WASM,
        document
      )
      return parseResult<Parsed>(result[WASMQUERY])
    }
  },
})

/* helpers */
export const getDocument = ({ contract, msg }: ContractVariables) => {
  return { contract, msg: JSON.stringify(msg) }
}

export const fetchGraphQLAPI = async (variables: object) => {
  // query to fetch pool
  const url = "https://tequila-mantle.terra.dev/"
  const body = {
    variables,
    query:
      "query ($contract: String, $msg: String) {\n  WasmContractsContractAddressStore(ContractAddress: $contract, QueryMsg: $msg) {\n    Height\n    Result\n    }\n}\n",
  }
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
  })
  const json: {
    data: {
      WasmContractsContractAddressStore: { Height: string; Result: string }
    }
  } = await response.json()
  const Result = json.data.WasmContractsContractAddressStore
  return Result && JSON.parse(Result.Result)
}

/**
 * simple fetch API
 *
 * @param url
 */
export const fetchAPI = async (url: string) => {
  const response = await fetch(url)
  return await response.json()
}


export async function postDataFetchAPI(url = '', data: object | [] = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'no-cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
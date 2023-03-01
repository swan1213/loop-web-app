import { DataKey } from "./useContract"

export const useCombineKeys = (keys: (DataKey | undefined)[]): Result => {

  return {
    data: {},
    loading: false,
    error: undefined,
  }
}

export default (results: (Result | undefined)[]): Result => {
  const findError = (results: (Result | undefined)[]) => {
    const errorResult = Object.values(results).find((result) => result?.error)
    return errorResult && errorResult.error
  }

  return {
    data: results.every((result) => result?.data),
    loading: results.some((result) => result?.loading),
    error: findError(results),
  }
}

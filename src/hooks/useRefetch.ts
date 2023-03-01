import { useEffect } from "react"
import { DataKey } from "./useContract"
import useCombineResult from "./useCombineResult"

export default (keys: DataKey[]) => {
  const result = []
  useEffect(() => {
    keys
      .filter((key) => result[key])
      .forEach((key) => {
        const { called, load, refetch } = result[key]
        !called ? load() : refetch && refetch()
      })
    // eslint-disable-next-line
  }, [JSON.stringify(keys)])
  const results = useCombineResult(keys.map((key) => result[key]))
  return results
}

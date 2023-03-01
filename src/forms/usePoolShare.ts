import { div, gt, lt } from "../libs/math"
import { percent } from "../libs/num"

const MIN = div(0.01, 100) // <0.01%

export default (modifyTotal?: (total: string) => string) => {

  return ({
    amount,
    total,
  }: {
    amount: string
    symbol?: string
    total?: string
    token?: string
  }) => {
    const totalSupply = total ?? "0"

    const ratio = div(amount, modifyTotal?.(totalSupply ?? "0") ?? totalSupply)
    const lessThanMinimum = lt(ratio, MIN) && gt(ratio, 0)
    const prefix = lessThanMinimum ? "<" : ""

    return {
      ratio,
      lessThanMinimum,
      minimum: MIN,
      prefix,
      text: `${prefix}${percent(lessThanMinimum ? MIN : ratio)}`,
    }
  }
}

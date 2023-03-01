import BigNumber from "bignumber.js"
import useFee from "./useFee"
import {useQuery} from "react-query";
import {TaxData} from "../types/tx";
import {TAX} from "../data/native/gqldocs";

export default () => {

  const { data, ...query } = useQuery<TaxData>(TAX)
  /*const data  = useTaxQuery()
  const fee = useFee()

  const rate = data?.TreasuryTaxRate?.Result ?? "0"
  const cap = data?.TreasuryTaxCapDenom?.Result ?? "0"*/

  // const { data, ...query } = useQuery<TaxData>(TAX)
  const fee = useFee()

  // const data  = useTaxQuery()
  const rate = data?.TreasuryTaxRate.Result
  const cap = data?.TreasuryTaxCapDenom.Result

  const calcTax = (amount: string) =>
    rate && cap
      ? BigNumber.min(new BigNumber(amount).times(rate), cap)
          .integerValue(BigNumber.ROUND_CEIL)
          .toString()
      : "0"

  const getMax = (balance: string) => {
    if (rate && cap) {
      const balanceSafe = new BigNumber(balance).minus(1e6)
      const calculatedTax = new BigNumber(balanceSafe)
        .times(rate)
        .div(new BigNumber(1).plus(rate))
        .integerValue(BigNumber.ROUND_CEIL)
        .toString()

      const tax = BigNumber.min(calculatedTax, cap)
      const max = BigNumber.max(
        new BigNumber(balanceSafe).minus(tax).minus(fee.amount),
        0
      )

      return max.toString()
    } else {
      return "0"
    }
  }

  return { ...data, calcTax, getMax, loading: false }
}

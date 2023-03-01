import { getAttrs } from "../../components/Button"
import { useState } from "react"
import useFee from "../../graphql/useFee"
import { LOOP } from "../../constants"
import {Fee, Msg} from "@terra-money/terra.js"
import { TxResult, useWallet } from "@terra-money/wallet-provider"
import { PostError } from "../../forms/FormContainer"
import useAddress from "../../hooks/useAddress";
import {useLCDClient} from "../../graphql/useLCDClient";

const button: ButtonProps = {
  className: "desktop",
  size: "sm",
  outline: false,
}

const SwapToLoop = ({
  setResponse,
  data,
}: {
  data: any
  setResponse: (record: TxResult | undefined, error:PostError | undefined) => void
}) => {
  /* submit */
  const [submitted, setSubmitted] = useState(false)

  const msgs = data
  const fee = useFee()
  const { post } = useWallet()
  const address =  useAddress()
  const { terra } = useLCDClient()

  const submit = async () => {
    setSubmitted(true)

    try{
      const { gasPrice } = fee

      const txOptions: { msgs: Msg[]; gasPrices: string; purgeQueue: boolean; memo: string | undefined, fee?: Fee } = {
        msgs,
        memo: undefined,
        gasPrices: `${gasPrice}uusd`,
        // fee: new Fee(gas, { uusd: plus(amount, !deduct ? tax : undefined) }),
        // fee: new Fee(gas, { uusd: plus(feeAmount, undefined) }),
        purgeQueue: true,
      }

      const signMsg = await terra.tx.create(
          [{ address: address }],
          txOptions
      )

      txOptions.fee = signMsg.auth_info.fee

      const extResponse = await post(txOptions)
      setSubmitted(false)
      setResponse(extResponse, undefined)
    }catch (error){
      setSubmitted(false)
      setResponse(undefined, error)
    }
  }

  return (
    <>
      <button {...getAttrs(button)} disabled={submitted} onClick={() => submit()}>
        {submitted ? 'Wait' : `Swap with ${LOOP}`}
      </button>
    </>
  )
}

export default SwapToLoop

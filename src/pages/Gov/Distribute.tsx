import { getAttrs } from "../../components/Button"
import useFee from "../../graphql/useFee"
import { TxResult, useWallet } from "@terra-money/wallet-provider"
import {Fee, Msg} from "@terra-money/terra.js"

import { plus } from "../../libs/math"
import { TooltipIcon } from "../../components/Tooltip"
import { PostError } from "../../forms/FormContainer"
import useAddress from "../../hooks/useAddress";
import {useLCDClient} from "../../graphql/useLCDClient";

const button: ButtonProps = {
  className: "desktop",
  size: "sm",
  outline: false,
}

const Distribute = ({
  label,
  setResponse,
  data,
  disabled
}: {
  disabled?: boolean
  label?: string
  data: any
  setResponse: (record: TxResult | undefined, error: PostError | undefined) => void
}) => {

  /* submit */
  // const [submitted, setSubmitted] = useState(false)
  // const [response, setReponse] = useState<TxResult>()

  const msgs = data
  const fee = useFee()
  const { post } = useWallet()
  const address =  useAddress()
  const { terra } = useLCDClient()

  const submit = async () => {
    try {
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

      const response = await post(txOptions)
      setResponse(response, undefined)
    }catch (error) {
      setResponse(undefined, error)
    }
  }

  return (
    <>
      <button {...getAttrs({...button, disabled: disabled})} onClick={() => submit()}>
        {label ?? "Distribute"} { disabled && <TooltipIcon content={'This feature is under development'} />}
      </button>
    </>
  )
}

export default Distribute

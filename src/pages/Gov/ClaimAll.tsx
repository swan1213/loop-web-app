import { getAttrs } from "../../components/Button"
import useNewContractMsg from "../../terra/useNewContractMsg"
import useFee from "../../graphql/useFee"
import { TxResult, useWallet } from "@terra-money/wallet-provider"
import {Fee, Msg} from "@terra-money/terra.js"

import { plus } from "../../libs/math"
import { TooltipIcon } from "../../components/Tooltip"
import { PostError } from "../../forms/FormContainer"
import {useProtocol} from "../../data/contract/protocol";
import useAddress from "../../hooks/useAddress";
import {useLCDClient} from "../../graphql/useLCDClient";

const button: ButtonProps = {
  className: "desktop",
  size: "sm",
  outline: false,
  color: "black",
  disabled: true,
}

const ClaimAll = ({
  setResponse,
  hide
}: {
  txs: Tx[]
  hide?: boolean
  setResponse: (record: TxResult | undefined, error:PostError | undefined) => void
}) => {
  const { contracts } = useProtocol()

  /* submit */
  // const [submitted, setSubmitted] = useState(false)
  // const [response, setReponse] = useState<TxResult>()
  const newContractMsg = useNewContractMsg()
  const msgs = [
    newContractMsg(contracts["loop_staking"] ?? "", {
      claim: {},
    }),
  ]
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
      { !hide && <button {...getAttrs(button)} onClick={() => submit()}>
        Claim All My Rewards <TooltipIcon content={'This feature is under development'} />
      </button>}
    </>
  )
}

export default ClaimAll

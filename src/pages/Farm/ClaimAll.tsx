import { getAttrs } from "../../components/Button"
import { useState } from "react"
import useNewContractMsg from "../../terra/useNewContractMsg"
import useFee from "../../graphql/useFee"
import { TxResult, useWallet } from "@terra-money/wallet-provider"
import {Fee, Msg} from "@terra-money/terra.js"

import { plus } from "../../libs/math"
import {useProtocol} from "../../data/contract/protocol";
import useAddress from "../../hooks/useAddress";
import {useLCDClient} from "../../graphql/useLCDClient";

const button: ButtonProps = {
  className: "desktop",
  size: "sm",
  outline: false,
}

const ClaimAll = ({
  setResponse,
}: {
  setResponse: (record: TxResult) => void
}) => {
  const { contracts } = useProtocol()
  /* submit */
  const [submitted, setSubmitted] = useState(false)
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
    setSubmitted(true)

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

    setResponse(extResponse)
  }

  return (
    <>
      <button {...getAttrs(button)} disabled={submitted} onClick={() => submit()}>
        { submitted ? 'Wait' : 'Claim All My Rewards' }
      </button>
    </>
  )
}

export default ClaimAll

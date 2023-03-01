import { Caption } from "../Admin"
import Page from "../../components/Page"
import LinkButton from "../../components/LinkButton"
import Container from "../../components/Container"
import extension from "../../terra/extension"
import styles from "./ClaimAirdrop.module.scss"
import Button from "../../components/Button"
import { useContractsAddress } from "../../hooks"
import { useState } from "react"
import useNewContractMsg from "../../terra/useNewContractMsg"
import useFee from "../../graphql/useFee"
import Result from "../../forms/Result"
import useClaimReceipt from "../../forms/receipts/useClaimReceipt"
import { TxResult, useWallet } from "@terra-money/wallet-provider"
import { Fee } from "@terra-money/terra.js/dist/core/Fee"

import { plus } from "../../libs/math"
import { PostError } from "../../forms/FormContainer"
import {useProtocol} from "../../data/contract/protocol";
import useAddress from "../../hooks/useAddress";
import {useLCDClient} from "../../graphql/useLCDClient";
import {Msg} from "@terra-money/terra.js";

const ClaimAirdrop = () => {
  const link = {
    to: "/admin",
    children: Caption.GO_BACK,
    outline: false,
  }

  const { contracts } = useProtocol()

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setReponse] = useState<TxResult | undefined>()
  const [errorResponse, setErrorResponse] = useState<PostError | undefined>(undefined)
  const newContractMsg = useNewContractMsg()

  const msgs = [
    newContractMsg(contracts["loop_airdrop"] ?? "", {
      claim: {},
    }),
  ]

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

      const response = await post(txOptions)
      setReponse(response)
    }catch (error){
      setErrorResponse(error)
    }
  }

  /* reset */
  const reset = () => {
    setReponse(undefined)
    setErrorResponse(undefined)
  }

  /* result */
  const parseClaimTx = useClaimReceipt()

  return (
    <Page title={"Claim Airdrop"} action={<LinkButton {...link} />}>
      <Container className={styles.container} sm>
        {response || errorResponse ? (
          <Result response={response} parseTx={parseClaimTx} error={errorResponse} onFailure={reset} />
        ) : (
          <>
            <h2 className={styles.heading}>Claim Value</h2>
            <h3 className={styles.rewards}>0.0000</h3>
            <Button
              size="lg"
              type="button"
              color="blue"
              onClick={() => submit()}
              className={styles.button}
            >
              Claim All
            </Button>
          </>
        )}
      </Container>
    </Page>
  )
}

export default ClaimAirdrop

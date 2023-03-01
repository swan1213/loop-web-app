import {useState} from "react"
import {Helmet} from "react-helmet"
import {TxResult} from "@terra-money/wallet-provider"

import Grid from "../components/Grid"
import Result from "../forms/Result"
import Container from "../components/Container"
import useClaimReceipt from "../forms/receipts/useClaimReceipt"
import {PostError} from "../forms/FormContainer"
import useFarmStakeReceipt from "../forms/receipts/useFarmStakeReceipt"
import {Type} from "./Stake"
import Page from "../components/Page"
import Farm4Page from "./Farm/Farm4Page"

const Farmv4 = () => {
  const [farmResponse, setFarmResponse] = useState<TxResult | undefined>(
      undefined
  )

  const [errorResponse, setErrorResponse] = useState<PostError | undefined>(
    undefined
  )

  const farmResponseFun = (
    res: TxResult | undefined,
    error: PostError | undefined,
    type: string = "farm_stake"
  ) => {
    if (error) {
      setErrorResponse(error)
    }
    if (res) {
      if (type === "farm_stake") {
        setFarmResponse(res)
      }
      if (type === "vested") {
        setVestedResponse(res)
      }
    }
  }
  const type = Type.UNSTAKE

  /* result */
  const parseTx = useFarmStakeReceipt(type, false)

  /* reset */
  const reset = () => {
    setFarmResponse(undefined)
    setResponseClaimAll(undefined)
    setVestedResponse(undefined)
    setErrorResponse(undefined)
  }

  const [responseClaimAll, setResponseClaimAll] = useState<TxResult>()
  const [vesteResponse, setVestedResponse] = useState<TxResult | undefined>()

  /* result */
  const parseClaimTx = useClaimReceipt()

  return <Grid>
      <Helmet>
        <title>Loop Markets | Farm</title>
      </Helmet>
      <Page title={""}>
        {farmResponse || errorResponse ? (
          <Container sm>
            <Result
              response={farmResponse}
              parseTx={parseTx}
              onFailure={reset}
              gov={false}
              error={errorResponse}
            />
          </Container>
        ) : vesteResponse || errorResponse ? (
          <Container sm>
            <Result
              response={vesteResponse}
              parseTx={parseTx}
              error={errorResponse}
              onFailure={reset}
            />
          </Container>
        ) : responseClaimAll || errorResponse ? (
          <Container sm>
            <Result
              response={responseClaimAll}
              parseTx={parseClaimTx}
              onFailure={reset}
              gov={false}
              error={errorResponse}
            />
          </Container>
        ) : <Farm4Page farmResponseFun={farmResponseFun}/> }
      </Page>
    </Grid>
}

export default Farmv4

import Page from "../../components/Page"
import GovHomeHeader from "./GovHomeHeader"
import RewardList from "./RewardList"
import Grid from "../../components/Grid"
import useDashboard, { StatsNetwork } from "../../statistics/useDashboard"
import Result from "../../forms/Result"
import { useState } from "react"
import useClaimReceipt from "../../forms/receipts/useClaimReceipt"
import Container from "../../components/Container"
import useDistributeReceipt from "../../forms/receipts/useDistributeReceipt"
import { TxResult } from "@terra-money/wallet-provider"
import { PostError } from "../../forms/FormContainer"

const GovHome = () => {
  const { network } = useDashboard(StatsNetwork.TERRA)

  const [responseDistribute, setResponseDistribute] = useState<TxResult>()
  const [responseClaimAll, setResponseClaimAll] = useState<TxResult>()
  const [responseSwap, setResponseSwap] = useState<TxResult>()
  const [errorResponse, setErrorResponse] = useState<PostError | undefined>(undefined)

  const setPageResponse = (response: TxResult | undefined, error: PostError | undefined): void => {
    response ? setResponseDistribute(response) : setErrorResponse(error)
  }

  const setClaimPageResponse = (response: TxResult | undefined, error: PostError | undefined): void => {
    response ? setResponseClaimAll(response) : setErrorResponse(error)
  }
  const setSwapResponse = (response: TxResult | undefined, error: PostError | undefined): void => {
    response ? setResponseSwap(response) : setErrorResponse(error)
  }

  /* reset */
  const reset = () => {
    setResponseClaimAll(undefined)
    setResponseDistribute(undefined)
    setResponseSwap(undefined)
    setErrorResponse(undefined)
  }

  /* result */
  const parseClaimTx = useClaimReceipt()
  const parseDistributedTx = useDistributeReceipt()

  return (
    <Page noBreak>
      {responseClaimAll || errorResponse ? (
        <Container sm>
          <Result
            response={responseClaimAll}
            parseTx={parseClaimTx}
            onFailure={reset}
            error={errorResponse}
          />
        </Container>
      ) : responseDistribute !== undefined || errorResponse ? (
        <Container sm>
          <Result
            response={responseDistribute}
            parseTx={parseDistributedTx}
            onFailure={reset}
            error={errorResponse}
          />
        </Container>
      ) : responseSwap !== undefined || errorResponse ? (
        <Container sm>
          <Result
            response={responseSwap}
            parseTx={parseDistributedTx}
            onFailure={reset}
            error={errorResponse}
          />
        </Container>
      ) : (
        <>
          <GovHomeHeader />
          <Grid>
            <RewardList
              setPageResponse={setPageResponse}
              setClaimPageResponse={setClaimPageResponse}
              setSwapResponsePage={setSwapResponse}
              network={network}
            />
          </Grid>
        </>
      )}
    </Page>
  )
}

export default GovHome

import {useState} from "react"
import {useLocation} from "react-router-dom"
import {Helmet} from "react-helmet"
import {TxResult} from "@terra-money/wallet-provider"

import Grid from "../components/Grid"
import Result from "../forms/Result"
import Container from "../components/Container"
import useClaimReceipt from "../forms/receipts/useClaimReceipt"
import {PostError} from "../forms/FormContainer"
import useFarmStakeReceipt from "../forms/receipts/useFarmStakeReceipt"
import {Type} from "./Stake"
import FarmPage from "./Farm/FarmPage"
import Page from "../components/Page"

export enum FarmType {
  "farm" = "Farm",
  "farm2" = "FarmBETA",
  "farm3" = "FarmV3",
}

export const useFarmPage = (pageName?: string | undefined)=>{
  const { pathname } = useLocation()
  const name = pathname.substring(1)
  return pageName ?? FarmType[name]
}

const Farm = () => {
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
        ) : <FarmPage farmResponseFun={farmResponseFun}/> }
      </Page>
    </Grid>
}

export default Farm

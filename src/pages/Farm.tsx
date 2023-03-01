import { useState } from "react"
import { TxResult } from "@terra-money/wallet-provider"
import { Helmet } from "react-helmet"
import {Loader} from "semantic-ui-react"

import Page from "../components/Page"
import Grid from "../components/Grid"
import ConnectionRequired from "../containers/ConnectionRequired"
import Header from "./Farm/Header"
import TopFarming  from "./Farm/TopFarming"
import Result from "../forms/Result"
import Container from "../components/Container"
import useClaimReceipt from "../forms/receipts/useClaimReceipt"
import useAddress from "../hooks/useAddress"
import { PostError } from "../forms/FormContainer"
import UserFarmList from "./Farm/UserFarmList"
import Boundary from "../components/Boundary"
import useFarmList from "./Farm/useFarmList"
import useFarmStakeReceipt from "../forms/receipts/useFarmStakeReceipt"
import {Type} from "./Stake"

export enum FarmType {
  "farm" = "Farm",
  "farm_beta" = "FarmBETA",
}

/*export const useFarmPage = ()=>{
  const { pathname } = useLocation()
  const name = pathname.substring(1)
  return FarmType[name]
}*/

const Farm = () => {
  const address = useAddress()
  const [farmResponse, setFarmResponse] = useState<TxResult | undefined>(
      undefined
  )

  const header = {
    total: "",
    hide: "",
  }
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
  const dataSource:any = useFarmList()

  return (
      <Grid>
        <Helmet>
          <title>Loop Markets | Farm</title>
        </Helmet>
        <Page title={""}>
          {!address ? (
              <ConnectionRequired />
          ) : farmResponse || errorResponse ? (
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
          ) : (
              <>
                <Grid>
                  <Header {...header} />
                </Grid>
                {/*<FarmRules/>*/}

                <Boundary
                    fallback={
                      <div className="dashboardLoader">
                        <Loader type="Oval" color="white" height={50} width={50} />
                      </div>
                    }
                >
                  <UserFarmList dataSource={dataSource} farmResponseFun={farmResponseFun} />
                </Boundary>

                <Boundary
                    fallback={
                      <div className="dashboardLoader">
                        <Loader type="Oval" color="white" height={50} width={50} />
                      </div>
                    }
                >
                  <TopFarming
                      hidden={false}
                      farmResponseFun={farmResponseFun}
                      dataSource={dataSource}
                  />
                </Boundary>

                {/*{disconnect && (
            <Button
              className="mobile"
              onClick={disconnect}
              color="secondary"
              outline
              block
              submit
            >
              Disconnect
            </Button>
          )}*/}
              </>
          )}
        </Page>
      </Grid>
  )
}

export default Farm

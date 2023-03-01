import { useState } from "react"
import { TxResult } from "@terra-money/wallet-provider"

import { LOOP, UUSD } from "../../constants"
import { format, lookupSymbol } from "../../libs/parse"
import styles from "./Holdings.module.scss"
import Card from "../../components/Card"
import Dl from "../../components/Dl"
import Price from "../../components/Price"
import { gt } from "../../libs/math"
import FarmStake from "../../components/FarmStake"
import { PostError } from "../../forms/FormContainer"
import Container from "../../components/Container"
import Result from "../../forms/Result"
import useStakeReceipt from "../../forms/receipts/useStakeReceipt"
import useFarmList from "../Farm/useFarmList";
import {Type} from "../Stake";
import {FarmType} from "../FarmBeta"
import {bound} from "../../components/Boundary"
import {DATASOURCE} from "../Farm/TopFarming";

interface Data {
  apr?: string
  staked: string
  stakable: string
  reward?: string
  symbol: string
  token: string
  lpToken: string
}

interface Props {
  loading: boolean
  price: string
  dataSource: Data[]
}

const Stake = ({ loading, dataSource, ...props }: Props) => {
  const { price } = props

  const dataExists = !!dataSource.length
  const description = dataExists && (
      <Dl
          list={[
            {
              title: `${LOOP} Price`,
              content: <Price price={format(price)} symbol={lookupSymbol(UUSD)} />,
            },
          ]}
      />
  )
  /*const link = {
    to: "/claim/all",
    children: MESSAGE.FARMING.Claim_all_rewards,
    outline: false,
  }*/

  const dataList: DATASOURCE[] = useFarmList()

  const [errorResponse, setErrorResponse] = useState<PostError | undefined>(
      undefined
  )
  const [farmResponse, setFarmResponse] = useState<TxResult | undefined>(
      undefined
  )
  const parseTx = useStakeReceipt(false,null)

  /* reset */
  const reset = () => {
    setFarmResponse(undefined)
    setResponseClaimAll(undefined)
    setVestedResponse(undefined)
    setErrorResponse(undefined)
  }
  const type = Type.UNSTAKE

  const [responseClaimAll, setResponseClaimAll] = useState<TxResult>()
  const [vesteResponse, setVestedResponse] = useState<TxResult | undefined>()

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

  return (
      <Card
          title={
            <b className={styles.poolToolTip}>Farm</b>
          }
          /*action={dataExists && <LinkButton {...link} />}*/
          description={description}
          loading={loading}
      >
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
        ) : (
            bound(dataList && dataList.length > 0 &&
                dataList
                    .filter((farm) => gt(farm.staked ?? "0", "0"))
                    .map((farm) => (
                        <FarmStake
                            hidden={false}
                            key={farm.lpToken}
                            farmResponseFun={farmResponseFun}
                            dataSource={farm}
                            type={type}
                            pageName={FarmType.farm}
                            farmContractType={farm.FarmContractType}
                        />
                    )), "loading...")
        )}
      </Card>
  )
}

export default Stake

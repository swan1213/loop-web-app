import Page from "../../components/Page"
import useHash from "../../libs/useHash"
import LinkButton from "../../components/LinkButton"
import { Container, Grid } from "semantic-ui-react"
import { Card } from "@material-ui/core"
import styles from "../../forms/Admin/RewardsInfo.module.scss"

import {
  useDistributeableBalanceOfDPH,
  useDistributeableBalanceOfHALO,
  useDistributeableBalanceOfLOOP,
  useDistributeableBalanceOfLOOP3,
  useDistributeableBalanceOfLOOPR,
  useDistributeableBalanceOfLUV3,
} from "../../data/farming/Rewards"
import { DPH, HALO, LOOP, LOOPR, LUV, SMALLEST } from "../../constants"
import { div, minus, plus } from "../../libs/math"
import {
  FarmContractTYpe,
  useListOfStakeableTokensQueryFarm2,
  useListOfStakeableTokensQueryFarm3,
} from "../../data/farming/FarmV2"
import { decimal, numbers } from "../../libs/parse"
import { useRecoilValue } from "recoil"
import {
  getPerDayReward12MonQuery,
  getPerDayReward18MonQuery,
  getPerDayReward3MonQuery,
  getTotalReward12MonQuery,
  getTotalReward18MonQuery,
  getTotalReward3MonQuery,
  getTotalRewardInContract12MonQuery,
  getTotalRewardInContract18MonQuery,
  getTotalRewardInContract3MonQuery,
} from "../../data/admin/staking"
import { PostError } from "../../forms/FormContainer"
import AdminTopFarming from "./AdminTopFarming"
import {useProtocol} from "../../data/contract/protocol"
import {useFarmsList} from "../Farm/useFarmBetaList";
import {useState} from "react";
import {TxResult} from "@terra-money/wallet-provider";

export enum Type {
  "REWARDS_INFO" = "reward_info",
}

const RewardsInfo = () => {
  const dataSource = useFarmsList(true)
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
      }
      if (type === "vested") {
      }
    }
  }

  const { hash: type } = useHash<Type>(Type.REWARDS_INFO)
  const tab = {
    tabs: [Type.REWARDS_INFO],
    current: type,
  }

  const link = {
    to: "/admin",
    children: "Go Back",
    outline: false,
  }
  const { getToken } = useProtocol()

  const loopReward = useDistributeableBalanceOfLOOP(FarmContractTYpe.Farm2)
  const looprReward = useDistributeableBalanceOfLOOPR(FarmContractTYpe.Farm2)
  const haloReward = useDistributeableBalanceOfHALO(FarmContractTYpe.Farm2)
  const dphReward = useDistributeableBalanceOfDPH(FarmContractTYpe.Farm2)
  const loop3Reward = useDistributeableBalanceOfLOOP3(FarmContractTYpe.Farm3)
  const luv3Reward = useDistributeableBalanceOfLUV3(FarmContractTYpe.Farm3)


  const stakeableListFarm2 = useListOfStakeableTokensQueryFarm2(
    FarmContractTYpe.Farm2
  )
  const stakeableListFarm3 = useListOfStakeableTokensQueryFarm3(
    FarmContractTYpe.Farm3
  )
  const rewardPerDay12Months = useRecoilValue(getPerDayReward12MonQuery)
  const rewardInContract12Months = useRecoilValue(
    getTotalRewardInContract12MonQuery
  )
  const reward12Months = useRecoilValue(getTotalReward12MonQuery)

  const rewardPerDay18Months = useRecoilValue(getPerDayReward18MonQuery)
  const rewardInContract18Months = useRecoilValue(
    getTotalRewardInContract18MonQuery
  )
  const reward18Months = useRecoilValue(getTotalReward18MonQuery)

  const rewardPerDay3Months = useRecoilValue(getPerDayReward3MonQuery)
  const rewardInContract3Months = useRecoilValue(
    getTotalRewardInContract3MonQuery
  )
  const reward3Months = useRecoilValue(getTotalReward3MonQuery)

  const LoopList = stakeableListFarm2.map((item) =>
    item.distribution.map((item) => {
      return item.token.token.contract_addr === getToken(LOOP)
        ? item.amount
        : "0"
    })
  )
  const LooprList = stakeableListFarm2.map((item) =>
    item.distribution.map((item) => {
      return item.token.token.contract_addr === getToken(LOOPR)
        ? item.amount
        : "0"
    })
  )
  const HaloList = stakeableListFarm2.map((item) =>
    item.distribution.map((item) => {
      return item.token.token.contract_addr === getToken(HALO)
        ? item.amount
        : "0"
    })
  )

  const DphList = stakeableListFarm2.map((item) =>
    item.distribution.map((item) => {
      return item.token.token.contract_addr === getToken(DPH)
        ? item.amount
        : "0"
    })
  )

  const Loop3List = stakeableListFarm3.map((item) =>
    item.distribution.map((item) => {
      return item.token.token.contract_addr === getToken(LOOP)
        ? item.amount
        : "0"
    })
  )

  const Luv3List = stakeableListFarm3.map((item) =>
  item.distribution.map((item) => {
    return item.token.token.contract_addr === getToken(LUV)
      ? item.amount
      : "0"
  })
)

  const LOOPvalues =
    LoopList && LoopList.length > 0
      ? LoopList.flat().reduce((a, b) => plus(a, b))
      : "0"

  const LOOPRvalues =
    LooprList && LooprList.length > 0
      ? LooprList.flat().reduce((a, b) => plus(a, b))
      : "0"

  const HALOvalues =
    HaloList && HaloList.length > 0
      ? HaloList.flat().reduce((a, b) => plus(a, b))
      : "0"

  const DPHvalues =
    DphList && DphList.length > 0
      ? DphList.flat().reduce((a, b) => plus(a, b))
      : "0"

  const LOOP3values =
    Loop3List && Loop3List.length > 0
      ? Loop3List.flat().reduce((a, b) => plus(a, b))
      : "0"

  const Luv3values =
    Luv3List && Luv3List.length > 0
      ? Luv3List.flat().reduce((a, b) => plus(a, b))
      : "0"    

  return (
    <>
    <Page title={" "} action={<LinkButton {...link} />}>
      <Container>
        <h1 className={styles.center}>Farming</h1>
        <small className={styles.address}>
          terra1cr7ytvgcrrkymkshl25klgeqxfs48dq4rv8j26
        </small>

        <Grid className={styles.wrapper}>
          <Card className={styles.card}>
            <h1>Rewards per hour</h1>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(div(LOOPvalues, SMALLEST))}
              </p>
              <p>
                <b className={styles.title}>{LOOPR}:</b>{" "}
                {numbers(div(LOOPRvalues, SMALLEST))}
              </p>
              <p>
                <b className={styles.title}>{HALO}:</b>{" "}
                {numbers(div(HALOvalues, SMALLEST))}
              </p>
              <p>
                <b className={styles.title}>{DPH}:</b>{" "}
                {numbers(div(DPHvalues, SMALLEST))}
              </p>
            </div>
          </Card>

          <Card className={styles.card}>
            <h1>Remaining Rewards</h1>
            <small>(that can be distributed)</small>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(div(loopReward, SMALLEST))}
              </p>
              <p>
                <b className={styles.title}>{LOOPR}:</b>{" "}
                {numbers(div(looprReward, SMALLEST))}
              </p>
              <p>
                <b className={styles.title}>{HALO}:</b>{" "}
                {numbers(div(haloReward, SMALLEST))}
              </p>
              <p>
                <b className={styles.title}>{DPH}:</b>{" "}
                {numbers(div(dphReward, SMALLEST))}
              </p>
            </div>
          </Card>
          <Card className={styles.card}>
            <h1>Expected Hours</h1>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {decimal(
                  div(div(loopReward, SMALLEST), div(LOOPvalues, SMALLEST)),
                  0
                )}{" "}
                hours
              </p>
              <p>
                <b className={styles.title}>{LOOPR}:</b>{" "}
                {decimal(
                  div(div(looprReward, SMALLEST), div(LOOPRvalues, SMALLEST)),
                  0
                )}{" "}
                hours
              </p>
              <p>
                <b className={styles.title}>{HALO}:</b>{" "}
                {decimal(
                  div(div(haloReward, SMALLEST), div(HALOvalues, SMALLEST)),
                  0
                )}{" "}
                hours
              </p>
              <p>
                <b className={styles.title}>{DPH}:</b>{" "}
                {decimal(
                  div(div(dphReward, SMALLEST), div(DPHvalues, SMALLEST)),
                  0
                )}{" "}
                hours
              </p>
            </div>
          </Card>
        </Grid>

        <h1 className={styles.center}>Farming 2</h1>
        <small className={styles.address}>
          terra1swgnlreprmfjxf2trul495uh4yphpkqucls8fv
        </small>
        <Grid className={styles.wrapper}>
          <Card className={styles.card}>
            <h1>Rewards per hour</h1>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(div(LOOP3values, SMALLEST))}
              </p>
              <p>
                <b className={styles.title}>{LUV}:</b>{" "}
                {numbers(div(Luv3values, SMALLEST))}
              </p>
            </div>
          </Card>

          <Card className={styles.card}>
            <h1>Remaining Rewards</h1>
            <small>(that can be distributed)</small>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(div(loop3Reward, SMALLEST))}
              </p>
              <p>
                <b className={styles.title}>{LUV}:</b>{" "}
                {numbers(div(luv3Reward, SMALLEST))}
              </p>
            </div>
          </Card>
          <Card className={styles.card}>
            <h1>Expected Hours</h1>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {decimal(
                  div(div(loop3Reward, SMALLEST), div(LOOP3values, SMALLEST)),
                  0
                )}{" "}
                hours
              </p>
              <p>
                <b className={styles.title}>{LUV}:</b>{" "}
                {decimal(
                  div(div(luv3Reward, SMALLEST), div(Luv3values, SMALLEST)),
                  0
                )}{" "}
                hours
              </p>
            </div>
          </Card>
        </Grid>
        <h1 className={styles.center}>Staking</h1>

        <Grid className={styles.wrapper}>
          <Card className={styles.card}>
            <h1>Rewards Per Day</h1>
            <small>(12 Months)</small>

            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(div(rewardPerDay12Months, SMALLEST))}
              </p>
            </div>
          </Card>

          <Card className={styles.card}>
            <h1>Remaining Rewards</h1>
            <small>(that can be distributed)</small>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(
                  div(minus(rewardInContract12Months, reward12Months), SMALLEST)
                )}
              </p>
            </div>
          </Card>
          <Card className={styles.card}>
            <h1>Expected Days</h1>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {decimal(
                  div(
                    div(
                      minus(rewardInContract12Months, reward12Months),
                      SMALLEST
                    ),
                    div(rewardPerDay12Months, SMALLEST)
                  ),
                  0
                )}{" "}
                Days
              </p>
            </div>
          </Card>
        </Grid>

        <Grid className={styles.wrapper}>
          <Card className={styles.card}>
            <h1>Rewards Per Day</h1>
            <small>(18 Months)</small>

            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(div(rewardPerDay18Months, SMALLEST))}
              </p>
            </div>
          </Card>

          <Card className={styles.card}>
            <h1>Remaining Rewards</h1>
            <small>(that can be distributed)</small>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(
                  div(minus(rewardInContract18Months, reward18Months), SMALLEST)
                )}
              </p>
            </div>
          </Card>
          <Card className={styles.card}>
            <h1>Expected Days</h1>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {decimal(
                  div(
                    div(
                      minus(rewardInContract18Months, reward18Months),
                      SMALLEST
                    ),
                    div(rewardPerDay18Months, SMALLEST)
                  ),
                  0
                )}{" "}
                Days
              </p>
            </div>
          </Card>
        </Grid>

        <Grid className={styles.wrapper}>
          <Card className={styles.card}>
            <h1>Rewards Per Day</h1>
            <small>(3 Months)</small>

            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(div(rewardPerDay3Months, SMALLEST))}
              </p>
            </div>
          </Card>

          <Card className={styles.card}>
            <h1>Remaining Rewards</h1>
            <small>(that can be distributed)</small>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {numbers(
                  div(minus(rewardInContract3Months, reward3Months), SMALLEST)
                )}
              </p>
            </div>
          </Card>
          <Card className={styles.card}>
            <h1>Expected Days</h1>
            <div className={styles.values}>
              <p>
                <b className={styles.title}>{LOOP}:</b>{" "}
                {decimal(
                  div(
                    div(
                      minus(rewardInContract3Months, reward3Months),
                      SMALLEST
                    ),
                    div(rewardPerDay3Months, SMALLEST)
                  ),
                  0
                )}{" "}
                Days
              </p>
            </div>
          </Card>
        </Grid>
        <Grid className={styles.adminFarming}>
          <Card>
          <AdminTopFarming
    hidden={false}
    farmResponseFun={farmResponseFun}
    dataSource={dataSource}
    />
          </Card>
        </Grid>
      </Container>
    </Page>
    </>
  )
}

export default RewardsInfo

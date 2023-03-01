import Page from "../../components/Page"
import { MenuKey } from "../Admin"
import LinkButton from "../../components/LinkButton"
import { menu } from "../Admin"
import { useRouteMatch } from "react-router-dom"
import Distribute from "../Gov/Distribute"
import { useState } from "react"
import useNewContractMsg from "../../terra/useNewContractMsg"
import { useContractsAddress } from "../../hooks"
import Container from "../../components/Container"
import Result from "../../forms/Result"
import useClaimReceipt from "../../forms/receipts/useClaimReceipt"
import { getAttrs } from "../../components/Button"
import styles from "./Admin.module.scss"
import { TxResult } from "@terra-money/wallet-provider"
import { PostError } from "../../forms/FormContainer"
import { Helmet } from "react-helmet"
import Grid from "../../components/Grid"
import {useProtocol} from "../../data/contract/protocol";

const button: ButtonProps = {
  className: "desktop " + styles.customSmBtn,
  size: "sm",
  outline: false,
}

const AdminHome = () => {
  const { url } = useRouteMatch()

  const airdrop_link = {
    to: url + menu[MenuKey.AIRDROPS].path,
    children: MenuKey.AIRDROPS,
    outline: false,
  }

  /*const give_weight_link = {
    to: url + menu[MenuKey.WEIGHT].path,
    children: MenuKey.WEIGHT,
    outline: false,
  }*/

  /*const tvl_link = {
    to: url + menu[MenuKey.TVL].path,
    children: MenuKey.TVL,
    outline: false,
  }*/

  const farms_link = {
    to: url + menu[MenuKey.FARMS].path,
    children: MenuKey.FARMS,
    outline: false,
  }

  const assign_rewards_link = {
    to: url + menu[MenuKey.ASSIGNFARMREWARDS].path,
    children: MenuKey.ASSIGNFARMREWARDS,
    outline: false,
  }
  const reward_staking_link = {
    to: url + menu[MenuKey.STAKING_REWARD].path,
    children: MenuKey.STAKING_REWARD,
    outline: false,
  }

  const update_lock_time = {
    to: url + menu[MenuKey.UPDATE_LOCK_TIME].path,
    children: MenuKey.UPDATE_LOCK_TIME,
    outline: false,
  }

  const add_stakable_tokens = {
    to: url + menu[MenuKey.ADD_STAKEABLE_TOKENS].path,
    children: MenuKey.ADD_STAKEABLE_TOKENS,
    outline: false,
  }

  const add_distribution_tokens = {
    to: url + menu[MenuKey.ADD_DISTRIBUTION_TOKEN].path,
    children: MenuKey.ADD_DISTRIBUTION_TOKEN,
    outline: false,
  }

  const view_rewards_time = {
    to: url + menu[MenuKey.VIEW_REWARD_TIME].path,
    children: MenuKey.VIEW_REWARD_TIME,
    outline: false,
  }

  const [errorResponse, setErrorResponse] = useState<PostError | undefined>(undefined)

  const [claimPageResponse, setClaimPageResponse] = useState<TxResult | undefined>()

  const setResponse = (response: TxResult | undefined, error: PostError | undefined): void =>
    response ? setClaimPageResponse(response) : setErrorResponse(error)

  const newContractMsg = useNewContractMsg()

  const { contracts } = useProtocol()

  const data = [
    newContractMsg(contracts["loop_farm_staking_v2"] ?? "", {
      distribute: {},
    }),
  ]

  const updateWeightForFarmingData = [
    newContractMsg(contracts["loop_farm_staking"] ?? "", {
      update_weights: {},
    }),
  ]

  const distributeLoopStakeRewardData = [
    newContractMsg(contracts["loop_staking"] ?? "", {
      distribute: {},
    }),
  ]

  const calculateMyRewardData = [
    newContractMsg(contracts["loop_farm_staking"] ?? "", {
      calculate_my_reward: {},
    }),
  ]

  /* result */
  const parseClaimTx = useClaimReceipt()

  /* reset */
  const reset = () => {
    setClaimPageResponse(undefined)
    setErrorResponse(undefined)
  }

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Admin</title>
      </Helmet>
    <Page
      action={
        !claimPageResponse && (
          <>
            {/*<Distribute
              label={"Calculate Bonus"}
              data={calculateBonusData}
              setResponse={setResponse}
            />*/}
            {/*<Distribute
              label={"Calculate my Reward"}
              data={calculateMyRewardData}
              setResponse={setResponse}
            />*/}
            {/*<LinkButton {...getAttrs(button)} {...give_weight_link} />*/}
            {/*<LinkButton {...getAttrs(button)} {...tvl_link} />*/}

            {/*<LinkButton {...getAttrs(button)} {...reward_staking_link} />*/}
          </>
        )
      }
    >
      <Page
          title={"Initialization"}
          action={
            !claimPageResponse && (
                <>
                  <LinkButton {...getAttrs(button)} {...add_stakable_tokens} />
                  <LinkButton {...getAttrs(button)} {...add_distribution_tokens} />
                  <LinkButton {...getAttrs(button)} {...assign_rewards_link} />
                </>
            )
          }>
        <Page
            title={"Distribute"}
            action={
              !claimPageResponse && (
                  <>
                    <Distribute
                        label={"4-Distribute farming reward"}
                        data={data}
                        setResponse={setResponse}
                    />
                    <Distribute
                        label={"Distribute Loop staking Reward"}
                        data={distributeLoopStakeRewardData}
                        setResponse={setResponse}
                    />
                  </>
              )
            }>
          <Page
              title={"Configuration"}
              action={
                !claimPageResponse && (
                    <>
                      <LinkButton {...getAttrs(button)} {...update_lock_time} />
                      <Distribute
                          label={"Update weight for farming"}
                          data={updateWeightForFarmingData}
                          setResponse={setResponse}
                      />
                      <LinkButton {...getAttrs(button)} {...farms_link} />
                      <LinkButton {...getAttrs(button)} {...airdrop_link} />
                    </>
                )
              }>
              <Page
              title={"Rewards"}
              action={
                    <>
                      <LinkButton {...getAttrs(button)} {...view_rewards_time} />
                    </>
              }>
      {claimPageResponse || errorResponse ? (
        <Container sm>
          <Result
            response={claimPageResponse}
            parseTx={parseClaimTx}
            onFailure={reset}
            error={errorResponse}
          />
        </Container>
      ) : (
        <></>
      )}
    </Page>
    </Page>
    </Page>
    </Page>
    </Page>
    </Grid>
  )
}

export default AdminHome

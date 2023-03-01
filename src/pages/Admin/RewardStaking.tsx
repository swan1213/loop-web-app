import Page from "../../components/Page"
import StakingRewardForm from "../../forms/Admin/StakingRewardForm"
import useHash from "../../libs/useHash"
import { LOOP } from "../../constants"
import { useContractsAddress } from "../../hooks"
import LinkButton from "../../components/LinkButton"
import {useProtocol} from "../../data/contract/protocol";


export enum Type {
  "REWARD" = "reward",
}

const RewardStaking = () => {

  const { hash: type } = useHash<Type>(Type.REWARD)
  const tab = {
    tabs: [Type.REWARD],
    current: type,
  }

  const { getToken } = useProtocol()
  const link = {
    to: "/admin",
    children: "Go Back",
    outline: false,
  }
  return (
    <Page title={' '} action={<LinkButton {...link} />}>
      <StakingRewardForm token={getToken(LOOP)} type={type} tab={tab} />
    </Page>
  )
}

export default RewardStaking

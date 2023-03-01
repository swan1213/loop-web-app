import { useRouteMatch } from "react-router-dom"
import { gt } from "../../libs/math"
import { useContract, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import Page from "../../components/Page"
import LinkButton from "../../components/LinkButton"
import { menu, MenuKey } from "../Stake"
import StakeHomeHeader from "./StakeHomeHeader"
import StakeList from "./StakeList"
import { Helmet } from "react-helmet"
import Grid from "../../components/Grid"

const StakeHome = () => {
  const { url } = useRouteMatch()
  // const { rewards } = useContract()

  const link = {
    to: url + menu[MenuKey.CLAIMALL].path,
    children: MenuKey.CLAIMALL,
    // disabled: !gt(rewards, 0),
    disabled: true,
    outline: false,
  }

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Stake</title>
      </Helmet>
    <Page
      title={MenuKey.INDEX}
      description={<StakeHomeHeader />}
      action={<LinkButton {...link} />}
    >
      <StakeList />
    </Page>
    </Grid>
  )
}

export default StakeHome

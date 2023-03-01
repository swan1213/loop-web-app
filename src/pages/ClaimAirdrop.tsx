import Page from "../components/Page"
import AdminClaimAirdropForm from "../forms/AdminClaimAirdropForm"
import { Helmet } from "react-helmet"
import Grid from "../components/Grid"

const ClaimAirdrop = () => {
  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Claim Airdrop</title>
      </Helmet>
    <Page title={"Claim Airdrop"}>
      <AdminClaimAirdropForm />
    </Page>
    </Grid>
  )
}

export default ClaimAirdrop

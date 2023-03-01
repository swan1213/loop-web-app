import { Helmet } from "react-helmet"
import Grid from "../components/Grid"
import Page from "../components/Page"
import Container from "../components/Container"
import AirdropForm from "../forms/AirdropForm"

const MakeAirdrop = () => {
  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Airdrop</title>
      </Helmet>
      <Page>
         <Container sm>
         <AirdropForm />
         </Container>
      </Page>
    </Grid>
  )
}

export default MakeAirdrop

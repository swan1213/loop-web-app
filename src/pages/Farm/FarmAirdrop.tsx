import { Helmet } from "react-helmet"
import Grid from "../../components/Grid"
import Page from "../../components/Page"
import Container from "../../components/Container"
import FarmAirdropForm from "../../forms/Farm/FarmAirdropForm";

const MakeAirdrop = () => {
  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Farm Airdrop</title>
      </Helmet>
      <Page>
         <Container sm>
         <FarmAirdropForm />
         </Container>
      </Page>
    </Grid>
  )
}

export default MakeAirdrop

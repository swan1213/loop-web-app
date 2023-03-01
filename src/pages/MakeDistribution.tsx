import { Helmet } from "react-helmet"
import Grid from "../components/Grid"
import Page from "../components/Page"
import Container from "../components/Container"
import DistributionForm from "../forms/DistributionForm"

const MakeDistribution = () => {

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Distribution</title>
      </Helmet>
      <Page>
        <Container sm>
          <DistributionForm />
        </Container>
      </Page>
    </Grid>
  )
}

export default MakeDistribution

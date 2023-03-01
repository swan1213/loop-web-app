import { MenuKey } from "../routes"
import Page from "../components/Page"
import { Helmet } from "react-helmet"
import Grid from "../components/Grid"

const Send = () => {
  const tab = { tabs: [MenuKey.SEND], current: MenuKey.SEND }
  // const shuttleList = useShuttleList()

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Send</title>
      </Helmet>
    <Page title={MenuKey.SEND}>
      {/*{shuttleList && <SendForm tab={tab} shuttleList={shuttleList} />}*/}
    </Page>
    </Grid>
  )
}

export default Send

/* hook */
/*
const useShuttleList = (): ShuttleList | undefined => {
  const { data: ethereum } = useTerraAssets("/shuttle/eth.json")
  const { data: bsc } = useTerraAssets("/shuttle/bsc.json")
  const { name } = useNetwork()

  return ethereum && bsc && { ethereum: ethereum[name], bsc: bsc[name] }
}
*/

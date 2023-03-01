import { Helmet } from "react-helmet"

import useHash from "../libs/useHash"
import { MenuKey } from "./Admin"
import Page from "../components/Page"
import TVLForm from "../forms/TVL/TVLForm"
import Grid from "../components/Grid"

export enum Type {
  "TVL" = "TVL",
  "SELL" = "sell",
}

const Exchange = () => {
  const { hash: type } = useHash<Type>(Type.TVL)
  const tab = {
    tabs: [Type.TVL],
    tooltips: undefined,
    current: type,
  }

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | TVL</title>
      </Helmet>
    <Page title={MenuKey.TVL}>
      <TVLForm type={type} tab={tab} key={type} />
    </Page>
    </Grid>
  )
}

export default Exchange

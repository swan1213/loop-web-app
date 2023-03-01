import { Helmet } from "react-helmet"

import useHash from "../libs/useHash"
import { MenuKey } from "./Admin"
import Page from "../components/Page"
import GiveWeightForm from "../forms/Weight/GiveWeightForm"
import LinkButton from "../components/LinkButton"
import Grid from "../components/Grid"

export enum Type {
  "WEIGHT" = "Weight",
}

const GiveWeight = () => {
  const { hash: type } = useHash<Type>(Type.WEIGHT)
  const tab = {
    tabs: [Type.WEIGHT],
    tooltips: ["Give custom weight to LP tokens"],
    current: type,
  }

  const link = {
    to: "/admin",
    children: "Go Back",
    outline: false,
  }

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Give Weight</title>
      </Helmet>
    <Page title={MenuKey.WEIGHT} action={<LinkButton {...link} />}>
      {type && <GiveWeightForm type={type} tab={tab} key={type} />}
    </Page>
    </Grid>
  )
}

export default GiveWeight

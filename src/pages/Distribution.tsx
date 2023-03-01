import { Helmet } from "react-helmet"
import Grid from "../components/Grid"
import Page from "../components/Page"
import DistributionShortcut from "../components/DistributionShortcut"
import styles from "../components/DistributionShortcut.module.scss"
import { getPath, MenuKey } from "../routes";

const Distribution = () => {
  const DistributionTeam = [
    {
      type: "Team",
      path: getPath(MenuKey.DISTRIBUTION_TEAM),
      disable: false
    }
  ];
  const DistributionInvestor = [
    {
      type: "Investor",
      path: getPath(MenuKey.DISTRIBUTION_INVESTOR),
      disable: false
    }
  ];
  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Distribution</title>
      </Helmet>
      <Page className={styles.page}>
        <Grid className={styles.container}>
          <Grid className={styles.section}>
            <DistributionShortcut data={DistributionTeam} type={"Team"} >
            </DistributionShortcut>
            <DistributionShortcut data={DistributionInvestor} type={"Investor"} >
            </DistributionShortcut>
          </Grid>
        </Grid>
      </Page>
    </Grid>
  )
}

export default Distribution

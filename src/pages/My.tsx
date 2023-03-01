import { Helmet } from "react-helmet"

import Page from "../components/Page"
import ConnectionRequired from "../containers/ConnectionRequired"
import useAddress from "../hooks/useAddress"
import Grid from "../components/Grid"
import Container from "../components/Container"
import styles from "./Page.module.scss"
import MyHoldingList from "./My/List/MyHoldingList"
import MyPoolList from "./My/List/MyPoolList"
import MyFarmUserStakeList from "./My/List/MyFarmUserStakeList"
import MyStakeList from "./My/List/MyStakeList"
import PortFolioAllAssets from "../components/PortfolioAllAssets/PortFolioAllAssets";
import PortFolioChart from "../components/PortfolioChart/PortFolioChart";
import {bound} from "../components/Boundary";
import {div} from "../libs/math";
import ProgressLoading from "../components/Static/ProgressLoading"
import chartStyles from "../components/PortfolioChart/PortFolioChart.module.scss"
import PortfolioAllAssetsLoading from "../components/Static/My/PortfolioAllAssetsLoading"
import PortfolioChartLoading from "../components/Static/My/PortfolioChartLoading"

const My = () => {
  const address = useAddress()
  // useTotalStakedByUser()
  // useAPRY()

  return (

      <Grid>
        <Helmet>
          <title>Loop Markets | My Page</title>
        </Helmet>
        <Page>
          {!address ? (
              <ConnectionRequired />
          ) : (
              <>
                <Container>

                    <Grid>
                        <Grid className={styles.grid}>
                          
                            { bound(<PortFolioAllAssets/>, <div className={chartStyles.pieChart}>
                                <div className={chartStyles.wrapper}><PortfolioAllAssetsLoading /></div>
                            </div>)}
                        </Grid>
                        <Grid className={styles.grid}>
                            { bound(<PortFolioChart/>,<div className={chartStyles.pieChart}>
                                <div className={chartStyles.wrapper}><PortfolioChartLoading /></div>
                            </div>)}
                        </Grid>
                    </Grid>
                  <Grid>
                    <MyHoldingList />
                  </Grid>
                  <Grid>
                    <MyPoolList />
                  </Grid>
                  <Grid>
                    <MyFarmUserStakeList />
                  </Grid>
                  <Grid>
                    <MyStakeList />
                  </Grid>

                  {/*<Grid>
            <HistoryList />
          </Grid>*/}
                </Container>
              </>
          )}
        </Page>
      </Grid>
  )
}

export default My

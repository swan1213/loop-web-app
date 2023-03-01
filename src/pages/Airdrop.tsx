import { Helmet } from "react-helmet"
import Grid from "../components/Grid"
import Page from "../components/Page"
import ClaimShortcut from "../components/ClaimShortcut"
import { LOOP } from "../constants"
import styles from "../components/ClaimShortcut.module.scss"
import {getPath, MenuKey} from "../routes";

const Airdrop = () => {
    /*const loopAirdrop = [
        {
            symbol: LOOP,
            path: getPath(MenuKey.LOOP_AIRDROP),
            disable: false
        }
    ];
    const LOOPRAirdrop = [
        {
            symbol: '#1',
            path: getPath(MenuKey.LOOPR_AIRDROP),
            disable: false
        },
        {
            symbol: '#2',
            path: getPath(MenuKey.LOOPR_AIRDROP_101),
            disable: false
        }
    ]*/

    const loopAirdrop = [
        {
            symbol: LOOP,
            path: getPath(MenuKey.LOOPR_AIRDROP_feb_22),
            disable: false
        }
    ];
    const looprAirdrop = [
        {
            symbol: 'LOOPR',
            path: getPath(MenuKey.LOOPR_AIRDROP_DEC_21),
            disable: true
        }
    ];
    return (
        <Grid>
            <Helmet>
                <title>Loop Markets | Airdrop</title>
            </Helmet>
            <Page className={styles.page}>
                {/* <Container sm> */}
                {/* <AirdropForm /> */}
                {/* <div className="farmWizard1">
          <h1>Farming wizard: Step 1</h1>
          <span className="closeWizard">+</span>
          <ul className="wizardSteps">
            <li className="wizardActive">
              <b>1</b>
            </li>
            <li>
              <b>2</b>
            </li>
            <li>
              <b>3</b>
            </li>
          </ul>
          <h6>Choose your pool:</h6>
          <ul className="wizardCheck">
            <li>
              <label>LUNA-LOOP</label>
              <span>
                100% <b>APY</b>
              </span>
              <div className="WizardChecked">
                <input type="checkbox" />
                <div></div>
              </div>
            </li>
            <li>
              <label>UST-LOOP</label>
              <span>
                125%% <b>APY</b>
              </span>
              <div className="WizardChecked">
                <input type="checkbox" />
                <div></div>
              </div>
            </li>
            <li>
              <label>MINE-UST</label>
              <span>
                99% <b>APY</b>
              </span>
              <div className="WizardChecked">
                <input type="checkbox" />
                <div></div>
              </div>
            </li>
            <li>
              <label>SST-UST</label>
              <span>
                35% <b>APY</b>
              </span>
              <div className="WizardChecked">
                <input type="checkbox" />
                <div></div>
              </div>
            </li>
          </ul>
          <button>
            NEXT <b></b>
          </button>
        </div>

        <div className="farmWizard1">
          <h1>Step 3</h1>
          <span className="closeWizard">+</span>
          <ul className="wizardSteps">
            <li className="wizardActiveDone">
              <b>1</b>
            </li>
            <li className="wizardActiveDone">
              <b>2</b>
            </li>
            <li className="wizardActive">
              <b>3</b>
            </li>
          </ul>
          <h6>Done!</h6>
          <div className="wizardDoneItems">
            <b>$7,500 LUNA + $7,500 LOOP </b>
            <p>Added to pool and currently farming</p>
            <p>
              Estimated APY: <b>$15,000/yr</b>
              <span>(100%)</span>
            </p>
          </div>

          <button>GO TO MY PAGE</button>
        </div> */}
                <Grid className={styles.container}>
                    <Grid className={styles.section}>
                        {/*<Grid className={styles.claimFarmDiv}>
                      <ClaimFarmShortcut path={getPath(MenuKey.CLAIM_AIRDROP)} title={'Claim Farming Airdrop # 1'}  className={styles.farm_airdrop_2} >
                          <Grid className={styles.claimFarmMsg}>
                              <p>
                                  Claim your farming rewards from 29th Oct to 5th Nov now.
                              </p>
                          </Grid>
                      </ClaimFarmShortcut>
                  </Grid>*/}
                        <Grid>
                            <ClaimShortcut data={loopAirdrop} symbol={LOOP} >
                                <>
                                    <p>
                                        LOOP tokens will be airdropped to LOOPR holders between the 7th and 10th day of each month.  Airdrops do not roll over.  Therefore, eligible LOOPR holders must claim their airdrops by the 6th of each month, or else they will forfeit their airdrop for the previous month.
                                    </p>
                                    <p>
                                        The amount of LOOPR held in your wallet or on the Loop Community site determines the amount of LOOP you receive in the airdrop.  If you hold no LOOPR at the time of the snapshot, you are not eligible to claim the LOOP airdrop.
                                    </p>
                                </>
                            </ClaimShortcut>
                            <ClaimShortcut data={looprAirdrop} symbol={'LOOPR'} >
                                <>
                                    <p>
                                        We will be conducting periodic LOOPR airdrops for all LOOPR holders. The more LOOPR you own, the larger your airdrop will be.
                                    </p>
                                    <p>
                                        Regularly engage with Loop Community articles and Loop social media platforms to keep updated when further details are announced about this airdrop.
                                    </p>
                                </>
                            </ClaimShortcut>
                        </Grid>
                    </Grid>
                </Grid>
                {/* </Container> */}
            </Page>
        </Grid>
    )
}

export default Airdrop

import { Helmet } from "react-helmet"
import Card from "./Card"
import styles from "./FarmingCommingSoon.module.scss"
import Grid from "./Grid"
import Switch from "react-switch"
import { useState } from "react"
import { Slider } from "@material-ui/core"
import { div, multiple, number } from "../libs/math";
import { decimal } from "../libs/parse";
import polygon_icon from "../images/icons/polygon.svg"
import useFarmingAPY from "../hooks/useFarmingAPY";
import Tooltip from "./Tooltip";
import LinkButton from "./LinkButton";
import Page from "./Page";
import { getPath, MenuKey } from "../routes";

const AppFooter = () => {
  const [swtichStaus, setSwitchStatus] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [showStep, setPoupStep] = useState(1)
  const handleState = () => {
    setSwitchStatus(!swtichStaus)
  }

  const closePoup = () => {
    setPoupStep(1)
    setShowPopup(!showPopup)
  }

  const changeStep = (stepValue) => {
    setPoupStep(stepValue)
  }
  const calFarmingAPY = useFarmingAPY()

  return (
    <>
      <Helmet>
        <title>Loop Markets | Farm</title>
      </Helmet>
      {/* Farming coming in <span className={styles.strong}>Columbus-5</span> */}
      <Card>
        <Grid className={styles.container}>
          <h6>Farming</h6>
          {
            !isNaN(number(calFarmingAPY)) && (<p className={styles.apr_section}>
              Current Farming APR: <img src={polygon_icon} alt={""} className={styles.polygon_icon} /><span className={styles.apr}>{decimal(multiple(calFarmingAPY, 100), 2)}</span>%
            </p>)
          }
          <div className={styles.claim_farming_container}>
            <LinkButton
              className={styles.claim_farming_btn}
              size={'md'}
              to={getPath(MenuKey.CLAIM_FARM_AIRDROP)}
              children={
                <Tooltip
                  content=""
                >
                  Claim LP Farming Rewards #1
                </Tooltip>
              }
            />
            <p>For 7th - 28th Oct</p>
          </div>
          {/* <p className={styles.info}>
            More powerful Farming functionality is coming with the Columbus-5
            upgrade soon
          </p>
          <p className={styles.info}>
            In the interim, if you want to get rewarded for providing liquidity
            on Loop then enable auto-farming below
          </p>
          <p className={styles.info}>
            Your rewards will be airdopped to you once the new farming
            functionality is live
          </p> */}
          <p className={styles.info}>
            From 29th Oct to 4th Nov, all liquidity providers on the Loop DEX will share in 1M LOOP tokens based on the amount and duration of liquidity provided! Pay date is approx 11th Nov. Our full farming contracts will go live after this period has ended.
          </p>
          <p className={styles.info}>
            We apologise for the delay. Our users' funds are the highest priority.
          </p>
          <p className={styles.info}>
            Your rewards will be airdopped to you once the new farming
            functionality is live.
          </p>
          <p className={styles.info}>
            if you want to get rewarded for providing liquidity on Loop then
            enable auto-farming below:
          </p>
          <div className={styles.infoSwitch}>
            Off
            <Switch
              onChange={handleState}
              checked={swtichStaus}
              onColor="#C83E93"
            />
            On
          </div>
        </Grid>
      </Card>
      <div
        className={
          showPopup ? styles.showFarmingModal : styles.hideFarmingModel
        }
      >
        <div className="farmWizard1">
          <h1
            className={
              showStep === 1 ? styles.showFarmingModal : styles.hideFarmingModel
            }
          >
            Farming wizard: Step 1
          </h1>
          <h1
            className={
              showStep === 2 ? styles.showFarmingModal : styles.hideFarmingModel
            }
          >
            Step 2
          </h1>
          <h1
            className={
              showStep === 3 ? styles.showFarmingModal : styles.hideFarmingModel
            }
          >
            Step 3
          </h1>
          <span className="closeWizard" onClick={() => closePoup()}>
            +
          </span>
          <ul className="wizardSteps">
            <li className={showStep === 1 ? "wizardActive" : ""}>
              <b onClick={() => changeStep(1)}>1</b>
            </li>
            <li className={showStep === 2 ? "wizardActive" : ""}>
              <b onClick={() => changeStep(2)}>2</b>
            </li>
            <li className={showStep === 3 ? "wizardActive" : ""}>
              <b onClick={() => changeStep(3)}>3</b>
            </li>
          </ul>

          {/* step 1 -- Start */}
          <div
            className={
              showStep === 1 ? styles.showFarmingModal : styles.hideFarmingModel
            }
          >
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
            <button onClick={() => changeStep(2)}>
              NEXT <b></b>
            </button>
          </div>
          {/* step 1 --- Ends */}
          {/* step 2--- Start */}
          <div
            className={
              showStep === 2 ? styles.showFarmingModal : styles.hideFarmingModel
            }
          >
            <h6>
              Which assets do you want to use?
              <p>Pool: LUNA-LOOP</p>
            </h6>
            <ul className="wizardAssets">
              <li>
                <div className="assetsLeft">
                  <b>LUNA</b>
                  <p>US$10,000 (125 LUNA)</p>
                </div>
                <div className="assetsRight">
                  <div className="assetsLeftValue">
                    <Slider
                      aria-label="LUNA"
                      defaultValue={100}
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="assetsRightValue">$10,000</div>
                </div>
              </li>
              <li>
                <div className="assetsLeft">
                  <b>UST</b>
                  <p>US$5,000 (5000 UST)</p>
                </div>
                <div className="assetsRight">
                  <div className="assetsLeftValue">
                    <Slider
                      aria-label="UST"
                      defaultValue={100}
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="assetsRightValue">$5,000</div>
                </div>
              </li>
              <li>
                <div className="assetsLeft">
                  <b>MINE</b>
                  <p>US$6,000 (34 MINE)</p>
                </div>
                <div className="assetsRight">
                  <div className="assetsLeftValue">
                    <Slider
                      aria-label="MINE"
                      defaultValue={0}
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="assetsRightValue">$0</div>
                </div>
              </li>
              <li>
                <div className="assetsLeft">
                  <b>SST</b>
                  <p>US$2,343 (45 SST)</p>
                </div>
                <div className="assetsRight">
                  <div className="assetsLeftValue">
                    <Slider
                      aria-label="SST"
                      defaultValue={0}
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="assetsRightValue">$0</div>
                </div>
              </li>
            </ul>
            <div className="assetsTotalValue">
              <p>
                Total: <b>15,000</b> UST
              </p>
              <p>
                Gas: <b>13</b> UST
              </p>
              <p>
                Estimated: <b>$7,500</b> LOOP - <b>$7,500</b> UST
              </p>
              <p>
                Estimated APY: <i>100%</i> <b>$1,500</b>/yr
              </p>
            </div>
            <p>*assets will be auto-converted to LUNA-LOOP & pooled</p>
            <button onClick={() => changeStep(3)}>
              AUTO CONVERT & POOL <b></b>
            </button>
          </div >
          {/* step 2 ---Ends */}
          {/* step 3---- Start */}
          <div
            className={
              showStep === 3 ? styles.showFarmingModal : styles.hideFarmingModel
            }
          >
            <h6>Done!</h6>
            <div className="wizardDoneItems">
              <b>$7,500 LUNA + $7,500 LOOP </b>
              <p>Added to pool and currently farming</p>
              <p>
                Estimated APY: <b>$15,000/yr</b>
                <span>(100%)</span>
              </p>
            </div>

            <button onClick={() => closePoup()}>GO TO MY PAGE</button>
          </div>
          {/* step 3 --- Ends */}
        </div >
      </div >
    </>
  )
}

export default AppFooter

import { useRouteMatch } from "react-router-dom"
import Tooltip from "../../lang/Tooltip.json"
import { LOOP } from "../../constants"
// import { ReactComponent as Logo } from "../../images/icon-white.svg"
// import Logo from "../../images/icon-white.png"
import Logo from "../../images/logo_sm.svg"
import { percent } from "../../libs/num"
import Count from "../../components/Count"
import LinkButton from "../../components/LinkButton"
import { TooltipIcon } from "../../components/Tooltip"
import styles from "./GovMIR.module.scss"
import useDashboard from "../../statistics/useDashboard"
import Card from "../../components/Card"
import Grid from "../../components/Grid"

const GovMIR = () => {

  /* apr */
  const { dashboard } = useDashboard()

  /* link */
  const { url } = useRouteMatch()
  const stake = { to: url + "/stake", className: styles.button }

  return (
    <Card title={'Loop (LOOP)'}>
      <div className={styles.body}>
        <Grid>
          <div className={styles.logo_container}>
            <img src={Logo} height={60} className={styles.logo} alt={"/"} />
          </div>
        </Grid>
        <Grid className={styles.stake}>
          <div className={styles.staked_loop}>
            <LinkButton {...stake} size="sm">
              + Stake
            </LinkButton>
          </div>
          <div className={styles.staked_loop}>
            <div>
              Staked Loop
            </div>
            <div>
              <span className={styles.apr}>
                <Count>{dashboard?.govAPR}</Count>
              </span>
            </div>
          </div>

        </Grid>
        <Grid className={styles.stakable}>
          <div className={styles.stakable_row}>
            <div>
              <TooltipIcon content={Tooltip.Gov.APR}>
                Annual percentage rate (APR)
              </TooltipIcon>
            </div>
            <div>
              <span className={styles.apr}>
                <Count format={percent}>{dashboard?.govAPR}</Count>
              </span>
            </div>
          </div>
          <div className={styles.stakable_row}>
            <div>
              <TooltipIcon content={''}>
                Stakable Loop
              </TooltipIcon>
            </div>
            <div>
              <span className={styles.apr}><Count>{dashboard?.govAPR}</Count></span>
              <span className={styles.loop}> { LOOP }</span>
            </div>
          </div>
        </Grid>
      </div>
    </Card>
    /*<article className={styles.component}>
      <div className={styles.logo}>
        <img src={Logo} height={60} alt={"/"} />
      </div>

      <h1 className={styles.title}>Loop ({LOOP})</h1>

      <section>
        <span className={styles.apr}>
          <Count format={percent}>{dashboard?.govAPR}</Count>
        </span>

        <section className={styles.desc}>
          <TooltipIcon content={Tooltip.Gov.APR}>
            Annual percentage rate (APR)
          </TooltipIcon>
        </section>
      </section>

      <LinkButton {...stake} size="sm" outline>
        Stake
      </LinkButton>

      {address && <GovMIRFooter />}
    </article>*/
  )
}

export default GovMIR

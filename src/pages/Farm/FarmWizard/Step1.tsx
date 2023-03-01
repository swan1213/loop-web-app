import styles from "./Step1.module.scss"
import FarmWizardStep1MiniForm from "../../../forms/Farm/FarmWizardStep1MiniForm"
import {Type} from "../../LoopStake"
import Card from "../../../components/Card"
import Steps from "../../../components/Static/Steps"
import {FarmContractTYpe} from "../../../data/farming/FarmV2"
import Header from "./Header";


const Step1 = ({lp, ticker, farmType}:{lp:string, ticker: string, farmType: FarmContractTYpe}) => (
  <article className={styles.component}>
      <Card className={styles.container}>
          <Header />
          <div className={styles.content}>
              <Steps current={'1'} />
              <div className={styles.form}>
                  <h1>Unfarm and Claim rewards</h1>
                  <h2>{ticker?.toUpperCase() ?? ''}</h2>
                  {/*<div className={styles.info}>
                  <p>Your min 2 week farming period is over.</p>
                  <p>Unfarm everything with rewards?</p>
              </div>*/}
                  {/*<p className={styles.msg}>Partial withdrawals will be supported in the future.</p>*/}
                  <FarmWizardStep1MiniForm type={Type.UNSTAKE} farmType={farmType} lpToken={lp} farmResponseFun={()=>{}} />
              </div>
          </div>
      </Card>
  </article>
)

export default Step1

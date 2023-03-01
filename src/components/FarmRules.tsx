import { useState } from "react"

import styles from "./FarmRules.module.scss"
import Grid from "./Grid"
import Card from "./Card"
import Button from "./Button"
import { TooltipIcon } from "./Tooltip"

const FarmRules = () => {

  const [show, setShow] = useState(false)
  const toggle = () => {
    setShow(!show)
  }

  return (
    <div>
      <Grid>
        <div className={styles.tooltip_container}>
          <Button className={styles.toggle_btn} onClick={()=> toggle()}>{ show && 'Hide'} How Farm Works</Button>
          <TooltipIcon className={styles.tooltip} content={' How Farm Works'} />
        </div>
      </Grid>
      {
        show && <Card className={styles.rules_card}>
          <h2>How Farming Works</h2>
          <br />
          <>
            <p>- Rewards start accumulating immediately.</p>
            <p>- Rewards are now distributed hourly.</p>
            <p>- Estimated rewards over the next hour are now visible.</p>
            <p>- There is a 1 week minimum staking period before rewards can be claimed, but you can withdraw at any time.</p>
            <p>- If you stake more LP at any time the 1 week timer will be reset.</p>
            <p>- Our farming contracts have been audited internally and by a third party. The official TFL audit is still in progress.</p>
          </>
        </Card>
      }
    </div>
  )
}

export default FarmRules

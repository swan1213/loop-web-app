import styles from "./Steps.module.scss"
import classnames from "classnames"
import {gte, minus} from "../../libs/math"
import useStep from "../../hooks/Farm/useStep"

const Step = ({step, current}:{step: string | number, current: string}) => {
    const {searchQ} = useStep(step, minus(step, step).toString())
    return <a href={step == '5' ? '/my':  `/farm-wizard?${searchQ}`} target={'_self'} className={classnames(styles.step, gte(current, step) ? styles.fill : "", current == step ? styles.active : '')}>{step}</a>
}

const Steps = ({current}:{ current: string}) => {

  return (
      <div className={styles.steps}>
        <div className={styles.container}>
          <div className={styles.progressWrap}>
            <div className={styles.progress} id="progress"></div>
              <Step step={1} current={current}  />
              <Step step={2} current={current} />
              <Step step={3} current={current} />
              <Step step={4} current={current} />
          </div>
        </div>
      </div>
  )
}

export default Steps

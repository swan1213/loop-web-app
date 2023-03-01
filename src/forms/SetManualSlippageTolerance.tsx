import { useState } from "react"
import classNames from "classnames/bind"
import { gt, gte, isFinite, lte } from "../libs/math"
import { LocalStorage } from "../libs/useLocalStorage"
import styles from "./SetManualSlippageTolerance.module.scss"

const cx = classNames.bind(styles)

const SlippageTolerance = ({ state, error }: Props) => {
  const [value, setValue] = state
  const [focused, setFocused] = useState(false)
  const list = ["0"]

  const feedback = error
    ? { status: "error", message: error }
    : gt(value, 100) || lte(value, 0) || !isFinite(value)
    ? { status: "error", message: "Enter a valid slippage percentage" }
    : gte(value, 50)
    ? { status: "warning", message: "Your transaction may be frontrun" }
    : lte(value, 1)
    ? { status: "warning", message: "Your transaction may fail" }
    : !list.includes(value)
    ? { status: "success" }
    : undefined
  return (
    <div className={styles.card}>
      <section className={styles.list + " " + styles.slippageList}>
        <section
          className={cx(styles.item, styles.group, focused && feedback?.status)}
        >
          <span className={styles.title}>Slippage</span>
          <div className={styles.slippageHub}>
            <input
              className={cx(styles.input, {
                focused: focused || feedback?.status === "success",
              })}
              value={value}
              placeholder={"5"}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              max={100}
              min={0.1}
            />
            <span className={styles.title}>%</span>
          </div>
        </section>
      </section>
      {feedback && focused && (
        <p className={cx(styles.feedback, feedback.status)}>
          {feedback.message}
        </p>
      )}{" "}
    </div>
  )
}

interface Props {
  state: LocalStorage<string>
  error?: string
}

const SetManualSlippageTolerance = (props: Props) => {
  return (
    <div className={styles.component}>
      <SlippageTolerance {...props} />
    </div>
  )
}

export default SetManualSlippageTolerance

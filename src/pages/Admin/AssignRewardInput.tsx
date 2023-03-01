import React from "react"
import styles from "./AssignFarmReward.module.scss"
import classNames from 'classnames'

interface Props {
  data: any
  handleInputChange: (e: any, i: number) => void
  index: number
}

const AssignRewardInput = ({ data, handleInputChange, index }: Props) => {
  return (
    <div className={styles.inputContainer}>
      <div className={classNames(styles.tokenGroup)}>
        <label className={styles.label}>{data.name ?? "Pair"}</label>
        <input
          type="number"
          className={styles.input_token}
          placeholder={`Enter ${data.name ?? ''} reward`}
          name="reward"
          onChange={(e) => handleInputChange(e, index)}
          value={data.reward ?? "0"}
        />
      </div>
      <div className={styles.error_container}>{ (parseFloat(data.reward) <= 0 || !data.reward) && <p className={styles.error}>Required</p>}</div>
    </div>
  )
}

export default AssignRewardInput
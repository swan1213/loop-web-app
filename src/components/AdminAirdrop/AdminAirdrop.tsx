import React from "react"
import styles from "../../forms/AdminAirdropForm.module.scss"

interface Props {
  token: string
  value: string
  handleInputChange: (e: any, i: number) => void
  index: number
}

const AdminAirdrop = ({ token, value, handleInputChange, index }: Props) => {
  return (
    <div className={styles.inputContainer}>
      <div className={`${styles.tokenGroup} ${styles.inputHolder}`}>
        <label>User {index + 1}</label>
        <input
          type="text"
          className={styles.input_token}
          placeholder="Token Address"
          name="token"
          onChange={(e) => handleInputChange(e, index)}
          value={token}
        />
      </div>
      <div className={`${styles.valueGroup} ${styles.inputHolder}`}>
        <label>Amount</label>
        <input
          type="text"
          className={styles.input_value}
          placeholder="Amount"
          name="value"
          onChange={(e) => handleInputChange(e, index)}
          value={value}
        />
      </div>
    </div>
  )
}

export default AdminAirdrop

import React from "react"
import styles from "./FarmApyTooltipContent.module.scss"
import classNames from "classnames/bind"
import { plus } from "../libs/math"

const farmApyTooltipContent = ({ apr, tx_fee_apy, apy, symbol }) => {

  return (
    <div className={styles.tolBox}>
      <div className={styles.d_flex_col}>
        <span className={classNames(styles.d_flex_col)}>
          <h3>Current APY</h3>
          <h2 className={styles.blue}>{apy}</h2>
        </span>

        <span className={classNames(styles.d_flex_col, styles.pt10)}>
          <h3>Breakdown:</h3>
          {tx_fee_apy}
        </span>
        <span>
          {symbol == "LunaX - LUNA" && (
            <h3>SD APR 11.6% (excluded from weekly compounding estimation)</h3>
          )}
        </span>
        <span>
          <h3>
            = Total {apr} APR or{" "}
            {apy} APY*
          </h3>
        </span>

        <span className={classNames(styles.d_flex_col, styles.pt10)}>
          <h3>Annual Percentage Yield, if compounded weekly by user</h3>
        </span>
      </div>
    </div>
  )
}

export default farmApyTooltipContent

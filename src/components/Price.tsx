import styles from "./Price.module.scss"
import classnames from "classnames"
import { ReactElement } from "react"

const Price = ({price, symbol, symbol_info, classNames, symbolClass}: {price: string | ReactElement, symbol?: string, symbol_info?: string, classNames?: string, symbolClass?: string}) => {
  return (
    <span className={styles.price}> <span className={classnames(styles.value, classNames)}>{price}</span> <span className={classnames(styles.symbol, symbolClass)}>{symbol} </span>{ symbol_info && <span className={classnames(styles.symbol_info)}>{symbol_info}</span>}</span>
  )
}

export default Price

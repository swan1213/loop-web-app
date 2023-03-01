import classNames from "classnames/bind"
import Loading from "./Loading"
import styles from "./Button.module.scss"

const cx = classNames.bind(styles)

const Button = (props: Button) => {
  const { loading, children ,icon } = props
  const pageName = window.location.pathname
  return (
    <button {...getAttrs(props)}>
      {loading && <Loading className={styles.progress} />}
      {/* {pageName == "/swap" && children !== 'MAX' && ( */}
        {icon &&
        <img src={icon} className={styles.swapIcon} />
        }
      {/* )} */}
      {children}
    </button>
  )
}

export default Button

/* styles */
export const getAttrs = <T extends ButtonProps>(props: T) => {
  const { size = "sm", color = "blue", outline, block, ...rest } = props
  const { loading, submit, ...attrs } = rest
  const status = { outline, block, loading, disabled: attrs.disabled, submit }
  const className = cx(styles.button, size, color, status, attrs.className)
  return { ...attrs, className }
}

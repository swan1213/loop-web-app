import { FC } from "react"
import classNames from "classnames/bind"
import styles from "./Grid.module.scss"

const cx = classNames.bind(styles)

const Grid: FC<{ wrap?: number; className?: string, onClick?: ()=> void }> = ({
  children,
  wrap,
  className,
  onClick,
}) => (
  <div
    className={cx(
      styles.row,
      { wrap, [`wrap-${wrap}`]: wrap },
      className ? className : ""
    )}
    onClick={onClick}
  >
    {children}
  </div>
)

export default Grid

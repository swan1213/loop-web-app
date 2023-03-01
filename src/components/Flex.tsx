import { FC } from "react"
import classNames from "classnames/bind"
import styles from "./Flex.module.scss"

const cx = classNames.bind(styles)

interface Props {
  className?: string
  flex?: number
}

const Flex: FC<Props> = ({ children, className, flex = 1 }) => (
  <div className={cx(!flex ? "container" : `flex-${flex}`, className)}>
    {children}
  </div>
)

export default Flex

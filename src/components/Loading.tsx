import { CircularProgress } from "@material-ui/core"
import styles from "./Loading.module.scss"
import sanbox from '../images/sandbox_loading.svg'
import classNames from "classnames/bind";

const cx = classNames.bind(styles)

interface Props {
  size?: number
  className?: string
}

const Loading = ({ size, className }: Props) => (
  <div className={cx(styles.center, className)}>
    <CircularProgress color="inherit" size={size ?? 24} className={className} />
  </div>
)

export default Loading

export const SandLoading = ({ size = 40, className }: Props) => (
    <div className={styles.center}>
        <img src={sanbox} height={size} alt={'loading...'} className={cx(className, styles.rotate)} />
    </div>
)
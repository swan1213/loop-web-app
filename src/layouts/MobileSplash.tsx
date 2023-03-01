import classNames from "classnames"
import Icon from "../components/Icon"
import styles from "./MobileSplash.module.scss"

const MobileSplash = () => {
  return (
    <div className={classNames(styles.component, "mobile")}>
      <Icon name="Loop" size={80} />
    </div>
  )
}

export default MobileSplash

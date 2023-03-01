import Icon from "../components/Icon"
import styles from "./FormIcon.module.scss"

const FormIcon = ({
  name,
  onClick,
}: {
  name: string
  onClick?: () => void
}) => (
  <div className={styles.wrapper} onClick={() => onClick?.()}>
    <Icon name={name} size={24} />
  </div>
)

export default FormIcon

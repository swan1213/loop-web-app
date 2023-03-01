import { FC } from "react"
import classNames from "classnames/bind"
import Icon from "./Icon"
import styles from "./FormFeedback.module.scss"

const cx = classNames.bind(styles)

const FormFeedback: FC<{ help?: boolean; notice?: boolean }> = ({
  children,
  help,
  notice,
}) => {
  const icon = { size: 16, className: cx(styles.icon, { red: !help }) }

  return (
    <div className={cx(styles.component, { help })}>
      {help ? (
        <Icon name="info_outline" {...icon} />
      ) : notice ? (
        <Icon name="info_outline" {...icon} />
      ) : (
        <Icon name="warning" {...icon} />
      )}
      <p className={!help ? styles.red : ""}>{children}</p>
    </div>
  )
}

export default FormFeedback

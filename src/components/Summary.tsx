import { FC, ReactNode } from "react"
import styles from "./Summary.module.scss"
import Grid from "./Grid"
import { div } from "../libs/math"
import classnames from "classnames"

interface Props {
  title: ReactNode
  footer?: string
  icon?: string
  labelClassName?: string
}

const Summary: FC<Props> = ({
  title,
  icon,
  footer,
  children,
  labelClassName,
}) => (
  <article className={styles.article}>
    <div className={styles.wrapper}>
      {icon ? (
        <>
          <Grid className={styles.wrapper}>
            {/*<Grid>*/}
            <div className={styles.lg}>
              <h1 className={classnames(styles.title, labelClassName)}>
                {title}
              </h1>
              <section className={styles.content}>{children}</section>
            </div>
            <div className={styles.sm}>
              <img src={icon} alt={""} className={styles.icon} />
            </div>
          </Grid>
        </>
      ) : (
        <>
          <h1 className={styles.title}>{title}</h1>
          <section className={styles.content}>{children}</section>
        </>
      )}
    </div>

    {footer && <footer className={styles.footer}>{footer}</footer>}
  </article>
)

export default Summary

import styles from "./ConfirmWIthUstPrice.module.scss"
import classNames from "classnames";

const ConfirmWithUstPrice = ({ list, className }: { list?: ContentValue[], className?: string }) => (
  <ul className={classNames(styles.list, className)}>
    {list &&
      list.map(({ title, content, value, showContent = true }, index) => (
        <li className={styles.item} key={index}>
          <article className={styles.article}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.content}>{ showContent ? content : "" }</p>
            <p className={styles.value}>{value}</p>
          </article>
        </li>
      ))}
  </ul>
)

export default ConfirmWithUstPrice

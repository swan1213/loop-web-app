import styles from "./Confirm.module.scss"
import classNames from "classnames";

const Confirm = ({ list, className }: { list?: Content[], className?: string }) => (
  <ul className={classNames(styles.list, className)}>
    {list &&
      list.map(({ title, content }, index) => (
        <li className={styles.item} key={index}>
          <article className={styles.article}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.content}>{content}</p>
          </article>
        </li>
      ))}
  </ul>
)

export default Confirm

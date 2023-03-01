import { FC } from "react"
import Card from "./Card"
import styles from "./Empty.module.scss"
const Empty: FC = ({ children }) => (
  <Card className={styles.popUpCard}>
    <section className="empty">{children}</section>
  </Card>
)

export default Empty

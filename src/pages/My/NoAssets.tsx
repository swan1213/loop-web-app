import { MenuKey } from "../../routes"
import styles from "./NoAssets.module.scss"

interface Props {
  description: string
  link?: MenuKey
}

const NoAssets = ({ description }: Props) => (
  <article className={styles.component}>
    <p className={styles.description}>{description}</p>
    {/* {link && (
      <LinkButton to={getPath(link)} className={styles.button} outline>
        {link}
      </LinkButton>
    )} */}
  </article>
)

export default NoAssets

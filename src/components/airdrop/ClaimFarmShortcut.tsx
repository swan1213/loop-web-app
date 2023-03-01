import styles from "../ClaimShortcut.module.scss"
import { ReactNode } from "react"
import classNames from "classnames";
import Grid from "../Grid";
import LinkButton from "../LinkButton";

interface Props {
    title?: string
    children?: ReactNode
    path: string
    disable?: boolean
    className?: string
}
const ClaimFarmShortcut = ({
                               title,
                               children,
                               path,
                               disable,
                               className
                           }: Props) => {

    /*const [isOpen] = useState<boolean>(false)*/

    return (
        <div className={classNames(styles.cardLoop, className)}>
            <div className={styles.walletLoop}>
                <Grid className={styles.claimFarmContainer}>
                    { children }
                    <Grid className={styles.claimFarmBtn}>
                        <LinkButton to={disable ? '' : path} disabled={disable}>{title ?? ""}</LinkButton>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default ClaimFarmShortcut

import styles from "./DistributionShortcut.module.scss"
import { ReactNode, useState } from "react"
import { icons } from "../routes"
import LinkButton from "./LinkButton"

const DistributionShortcut = ({ data, type, children }: {
    children: ReactNode, type: string, data: {
        type: string
        disable?: boolean
        path: string
    }[]
}) => {

    const [isOpen] = useState<boolean>(false)

    return !isOpen ? (
        <div className={styles.cardLoop}>
            <div className={styles.walletLoop}>
                <header className={styles.header}>
                    <div className={styles.headerLoop}>
                        <span className={styles.airdrop_icon}>
                            <img src={icons["airdrop"]} alt={""} />
                        </span>
                        <span className={styles.description}>
                            {type} Distribution
                            {
                                data && data.map((item) => (
                                    <>

                                        <LinkButton
                                            to={item.path}
                                            className={styles.claimButton}
                                            children={`Claim`}
                                        />
                                    </>
                                ))
                            }
                        </span>
                        <span className={styles.airdrop_icon}>
                            <img src={icons["airLoopIconLeft"]} alt={""} />
                        </span>
                    </div>
                </header>
                {
                    children
                }
            </div>
        </div>
    ) : (
        <></>
    )
}

export default DistributionShortcut

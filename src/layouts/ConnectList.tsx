import {useWallet} from "@terra-money/wallet-provider"
import styles from "./ConnectList.module.scss"
import QuestionMark from "../images/QuestionMark.svg"
import ExtLink from "../components/ExtLink"

const ConnectList = () => {
    const { connect,availableConnections,availableInstallations } = useWallet()

    return (
        <article className={styles.component}>
            <h1 className={styles.title}>Connect to a wallet</h1>
            <section style={{padding:'20px'}}>
                {availableConnections
                    .filter((wallet) => {
                        return !availableInstallations.some(
                            (i) => i.identifier === wallet.identifier
                        )
                    })
                    .map(({ type, identifier, name, icon }) =>
                        type === "READONLY" ? (
                            ""
                        ) : name === "Wallet Connect" ? (
                            <button
                                className={styles.button}
                                key={identifier+type}
                                onClick={() => connect(type, identifier)}
                            >
                                <img src={icon} alt={name} />
                                Connect Mobile Wallet
                            </button>
                        ) : (
                            <button
                                className={styles.button}
                                key={identifier+type}
                                onClick={() => connect(type, identifier)}
                            >
                                <img src={icon} alt={name} />
                                Connect {name}
                            </button>
                        )
                    )}
                {availableInstallations.map(({ type, identifier, name, icon, url }) => (
                    <button
                        className={styles.button}
                        key={identifier+type}
                        onClick={() => (window.open(
                            url,
                            '_blank'
                        ))}
                    >
                        <img src={icon} alt={name} />
                        Install {name}
                    </button>
                ))}
                <ExtLink href='/wallets' target='_self'>
                    <button
                        className={styles.button}
                        style={{marginTop:'20px'}}

                    >
                        <img src={QuestionMark} alt={'question'} />
                        Learn More About Terra Wallets
                    </button>
                </ExtLink>
            </section>
        </article>
    )
}

export default ConnectList

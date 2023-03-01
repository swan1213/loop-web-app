import styles from "./Header.module.scss"
import LinkButton from "../../../components/LinkButton";
import close from "../../../images/close_icon.svg"

export const Header = () => (<div className={styles.titleContainer}>
    <div className={styles.title}>
        <h1>Farming Upgrade</h1>
    </div>
    <div className={styles.closeCard}>
        <LinkButton to={'/my'} className={styles.close}><img src={close} alt={'close'} height={'25px'} width={'25px'} /></LinkButton>
    </div>
</div>)

export default Header

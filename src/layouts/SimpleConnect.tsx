import { useModal } from "../containers/Modal"
import ConnectListModal from "./ConnectListModal"
import useAddress from "../hooks/useAddress"
import { ReactNode } from "react"
import styles from "../components/ConnectButton.module.scss"
import { useWallet } from "@terra-money/wallet-provider"
import classNames from "classnames"

const SimpleConnect = ({children, customStyle}: { children: ReactNode, customStyle?: string}) => {
  const address = useAddress()
  const modal = useModal()
  const { disconnect } = useWallet()

  const handleClick = () => modal.open()

  return <>
      <button onClick={ !address ? handleClick : disconnect} className={classNames(styles.simpleBtnFlex, customStyle)}>
        { children }
      </button>
      { !address && <ConnectListModal {...modal} />}
    </>
}

export default SimpleConnect

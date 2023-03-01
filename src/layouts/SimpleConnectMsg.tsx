import { useModal } from "../containers/Modal"
import ConnectListModal from "./ConnectListModal"
import { ReactNode } from "react"
import styles from "../components/theme/Menu.module.scss"
import useAddress from "../hooks/useAddress"
import { useWallet } from "@terra-money/wallet-provider"

const SimpleConnectMsg = ({ children }: { children: ReactNode }) => {
  const address = useAddress()
  const modal = useModal()
  const { disconnect } = useWallet()

  const handleClick = () => modal.open()

  return (
    <>
      <button onClick={ !address ? handleClick : disconnect} className={styles.simpleBtnFlex}>
        { children }
      </button>
      <ConnectListModal {...modal} />
    </>
  )
}

export default SimpleConnectMsg

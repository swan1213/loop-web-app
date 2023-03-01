import MESSAGE from "../lang/MESSAGE.json"
import { useModal } from "../containers/Modal"
import ConnectButton from "../components/ConnectButton"
import Connected from "./Connected"
import ConnectListModal from "./ConnectListModal"
import useAddress from "../hooks/useAddress"

const Connect = () => {
  const address = useAddress()
  const modal = useModal()

  const handleClick = () => modal.open()

  return !address ? (
    <>
      <ConnectButton onClick={handleClick}>
        {MESSAGE.Wallet.ConnectWallet}
      </ConnectButton>

      <ConnectListModal {...modal} />
    </>
  ) : (
    <Connected/>
  )
}

export default Connect

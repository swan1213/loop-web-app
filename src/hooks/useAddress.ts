import { useConnectedWallet } from "@terra-money/wallet-provider"

const useAddress = () => {
  const connectedWallet = useConnectedWallet()
  return connectedWallet?.walletAddress ?? ""
}

export default useAddress

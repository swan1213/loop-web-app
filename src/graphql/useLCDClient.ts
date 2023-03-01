import {LCDClient } from "@terra-money/terra.js"
import {useWallet} from "@terra-money/wallet-provider"
import networks from "../networks"

export const useLCDClient = () => {
  const { network } = useWallet()
  const networkInfo = networks[network.name]
  const terra = new LCDClient({
    URL: networkInfo.lcd,
    chainID: network.chainID,
    gasAdjustment: 1.5,
  })

  return { terra }
}
export default useLCDClient
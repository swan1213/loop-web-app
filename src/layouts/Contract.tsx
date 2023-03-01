import { FC } from "react"
import { useContractsAddressState } from "../hooks/useContractsAddress"
import { ContractsAddressProvider } from "../hooks/useContractsAddress"
import Reconnect from "./Reconnect"
import useNetwork from "../hooks/useNetwork";

const Contract: FC = ({ children }) => {
  const network = useNetwork()
  const contractsAddress = useContractsAddressState()

  const empty =
    contractsAddress && !Object.values(contractsAddress.whitelist).length

  return !network.contract || empty ? (
    <Reconnect {...network} />
  ) : !contractsAddress ? null : (
    <ContractsAddressProvider value={contractsAddress}>
      {children}
    </ContractsAddressProvider>
  )
}

export default Contract

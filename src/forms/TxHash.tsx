import TxLink from "../components/TxLink"
import useNetwork from "../hooks/useNetwork";

const TxHash = ({ children: hash }: { children: string }) => {
  const { finder } = useNetwork()
  return <TxLink hash={hash} link={finder(hash, "tx")} />
}

export default TxHash

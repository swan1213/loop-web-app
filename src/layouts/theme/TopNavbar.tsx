import LoopLogo from "../../images/logo_lg.svg"
import TopHeader from "../../components/theme/TopHeader"
import Connect from "../Connect"
import useNetwork from "../../hooks/useNetwork";

const TopNavbar = () => {
  const { name } = useNetwork()
  return (
    <TopHeader
      logo={LoopLogo}
      connect={<Connect/>}
      testnet={name !== "mainnet"}
    />
  )
}

export default TopNavbar

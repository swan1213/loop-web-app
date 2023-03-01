import { useNetwork } from "../hooks"
// import { ReactComponent as Logo } from "../images/loop-logo.svg"
import LoopLogo from "../images/icons/loop_icon.svg"
import AppHeader from "../components/AppHeader"
import { MenuKey, getPath, omit } from "../routes"
import Connect from "./Connect"

const Header = () => {
  const menuKeys = Object.values(MenuKey).filter((key) => !omit.includes(key))
  const menu = menuKeys.map((key: MenuKey) => ({
    attrs: { to: getPath(key), children: key },
  }))
  const { name } = useNetwork()
  return (
    <AppHeader
      logo={LoopLogo}
      menu={menu}
      connect={<Connect />}
      testnet={name !== "mainnet"}
    />
  )
}

export default Header


// import { ReactComponent as Logo } from "../images/loop-logo.svg"
import LoopLogo from "../../images/logo_lg.svg"
import smLogo from "../../images/logo_sm.svg"
import AppHeader from "../../components/theme/AppHeader"
import {
  MenuKey,
  getPath,
  omit,
  getICon,
  additional,
  getICon2,
} from "../../routes"
import Connect from "../Connect"
import useNetwork from "../../hooks/useNetwork";

const Header = ({
  toggleSidebar,
}: {
  toggleSidebar: (status: boolean) => void
}) => {
  const menuKeys = Object.values(MenuKey).filter((key) => !omit.includes(key))
  const additionalKeys = Object.values(MenuKey).filter(
    (key) => !omit.includes(key) && additional.includes(key)
  )
  const menu = menuKeys.map((key: MenuKey) => ({
    attrs: {
      to: getPath(key),
      children: key,
      route_key: getICon(key),
      route_key1: getICon2(key),
    },
  }))
  const additionalMenu = additionalKeys.map((key: MenuKey) => ({
    attrs: {
      to: getPath(key) ?? "",
      children: key,
      route_key: getICon(key),
      route_key1: getICon2(key),
    },
  }))

  const { name } = useNetwork()
  return (
    <AppHeader
      logo={LoopLogo}
      smLogo={smLogo}
      menu={menu}
      additionalMenu={additionalMenu}
      connect={<Connect />}
      testnet={name !== "mainnet"}
      toggleSidebar={toggleSidebar}
    />
  )
}

export default Header

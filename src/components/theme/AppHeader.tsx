import { useEffect, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames/bind"
import Menu from "../theme/Menu"
import styles from "./AppHeader.module.scss"
import toggle_left_icon from "../../images/icons/toggle-left.png"
import toggle_right_icon from "../../images/icons/toggle-right.png"
import betaIcon from "../../images/icons/beta.svg"
import classnames from "classnames"
import useLocalStorage from "../../libs/useLocalStorage"
import { useRecoilState } from "recoil"
import { menuCollapsed } from "../../data/app"
// const cx = classNames.bind(styles)

interface Props {
  logo: string
  smLogo?: string
  menu: MenuItem[]
  additionalMenu: MenuItem[]
  connect: ReactNode
  border?: boolean
  testnet?: boolean
  toggleSidebar: (status: boolean) => void
}

const AppHeader = ({
  logo,
  menu,
  additionalMenu,
  toggleSidebar,
  smLogo,
}: Props) => {
  const { key, pathname } = useLocation()
  const [isOpen, setIsOpen] = useLocalStorage("hideMenu", false)
  const [menuCollapsedState, setMenuCollapsedState] =
    useRecoilState(menuCollapsed)
  const toggle = () => {
    setMenuCollapsedState(!isOpen)
    setIsOpen(!isOpen)
  }
  // const hideToggle = menu.every((item) => item.desktopOnly)

  useEffect(() => {
    toggleSidebar(isOpen)
  }, [isOpen, toggleSidebar])
  return (
    <header
      className={classNames(
        styles.header,
        styles.headerSize,
        isOpen && styles.toggle_header
      )}
    >
      {/* {isOpen ? smLogo : logo} */}
      <div className={styles.logoHead}>
        <h1 className={styles.logo}>
          <Link to="/" className={styles.logo_link}>
            <img src={logo} height={isOpen ? 30 : "100%"} alt={"/"} />
            {/*<img
              className={classnames(styles.beta, isOpen ? styles.beta_sm : "")}
              src={betaIcon}
              height={isOpen ? 30 : "100%"}
              alt={"/"}
            />*/}
          </Link>
        </h1>

        <div
          className={classNames(
            styles.navWrap,
            isOpen && styles.navWrapCollapsed
          )}
        >
          <nav>
            <ul>
              <Menu list={menu} isOpen={isOpen} key={key} current={pathname} />
            </ul>
          </nav>
          <nav>
            <ul>
              <Menu
                list={additionalMenu}
                isOpen={isOpen}
                key={key}
                current={pathname}
                ext={true}
                toggle={toggle}
              />
            </ul>
          </nav>
        </div>
      </div>
      {/* {!isOpen && ( */}
      {/* src={isOpen ? toggle_right_icon : toggle_left_icon} */}
      <div className={styles.toggle_container}>
        <img
          className={styles.toggle_icon}
          src={toggle_left_icon}
          onClick={() => toggle()}
        />
      </div>
      {/* )} */}
    </header>
  )
}

export default AppHeader

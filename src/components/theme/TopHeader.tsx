import { useState, useEffect, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames/bind"
import styles from "../AppHeader.module.scss"
import ExtLink from "../ExtLink"
import Menu from "./Menu"
import { getICon, getICon2, getPath, MenuKey, omit } from "../../routes"
import SocialDropdown from "../SocialDropdown/SocialDropdown"
import { getTopHeader } from "../../services/TopHeader"

const cx = classNames.bind(styles)

interface Props {
  logo: string
  // menu: MenuItem[]
  connect: ReactNode
  border?: boolean
  testnet?: boolean
}

const TopHeader = ({ connect, border }: Props) => {
  const pageName = window.location.pathname
  const { key, pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdown, setIsDropdown] = useState(false)
  const toggle = () => setIsOpen(!isOpen)
  // const hideToggle = menu.every((item) => item.desktopOnly)
  const [exchangeMenu, activeExchangeMenu] = useState(false)
  const [topHeader, setTopHeader] = useState<any>([])

  useEffect(() => {
    const headerFn = async () => {
      try{
        const header = await getTopHeader()
      setTopHeader(header)
      }
      catch(error){
        return error;
      }
    }
    headerFn()
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [key])

  const menuKeys = Object.values(MenuKey).filter((key) => !omit.includes(key))

  const menu = menuKeys.map((key: MenuKey) => ({
    attrs: {
      to: getPath(key),
      children: key,
      route_key: getICon(key),
      route_key1: getICon2(key),
    },
  }))
  const menuActive = () => {
    activeExchangeMenu(!exchangeMenu)
  }

  const windowWidth = window.innerWidth
  const value = 992
  return (
    <>
      <div
        className={isOpen ? "overlayPop" : "overlayPop1"}
        onClick={toggle}
      ></div>
      <header className={cx(styles.header, { collapsed: !isOpen })}>
        <div className={styles.headContainer}>
          <section className={styles.wrapper}>
            <h1 className={styles.logo}>
              <Link to="/" className={styles.logo_link}>
                {/* <img src={logo} alt={"/"} />
              <img
                className={styles.beta}
                src={betaIcon}
                height={"100%"}
                alt={"/"}
              /> */}
                <img src="../log-loop.png" alt="" />
              </Link>
            </h1>

            {/*{!hideToggle && (*/}
            <button className={styles.toggle} onClick={toggle}>
              {/* <Icon name={!isOpen ? "menu" : "close"} size={24} /> */}
              <img src="../menu.svg" alt="" />
            </button>
            {/*)}*/}
          </section>

          <section className={styles.support}>
            <div className={styles.connectLogo}>
              {!isOpen ? (
                <img src="../log-loop.png" alt="" />
              ) : (
                <div className={styles.mobileConnect}>{connect}</div>
                // <span>
                //   <img src="../logo_lg.svg" alt="" />
                //   <img src="../beta.svg" alt="" />
                // </span>
              )}
            </div>

            <button className={styles.connectLogoClose} onClick={toggle}>
              +
            </button>
            <div className={styles.menu_container}>
              <ul className={styles.menu}>
              {topHeader &&
                  topHeader?.data?.map((item: any) => {
                    if (item?.name == "Exchange") {
                      return (
                        <li
                        className={classNames(item?.id===item?.active && styles.active)}
                        key={item?.id}
                        >
                          <ExtLink
                            className={styles.link}
                            href={item.link}
                            target={"_self"}
                          >
                            {item.name}
                          </ExtLink>
                          <div
                            className={styles.pluMinus}
                            onClick={() => {
                              menuActive()
                            }}
                          >
                            <span
                              className={
                                exchangeMenu ? styles.exchangeActive : ""
                              }
                            >
                              +
                            </span>
                            <span
                              className={
                                exchangeMenu ? "" : styles.exchangeActive
                              }
                            >
                              -
                            </span>
                          </div>
                          {windowWidth < value ? (
                            <div
                              className={
                                exchangeMenu ? "CzExchangeSet" : "hideMenu"
                              }
                            >
                              <Menu
                                list={menu}
                                isOpen={false}
                                key={key}
                                ext={true}
                                sm
                                current={pathname}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </li>
                      )
                    } else {
                      return (
                        <li
                        className={item?.id===item?.active && styles.active}
                        key={item?.id}
                        >
                          <ExtLink
                            className={styles.link}
                            href={item.link}
                            target={"_self"}
                          >
                            {item.name}
                          </ExtLink>
                        </li>
                      )
                    }
                  })}
              </ul>
            </div>

            <div>
              <SocialDropdown />
            </div>

            <div className={styles.connect}>{connect}</div>
          </section>
        </div>

        {border && !isOpen && <hr className={styles.hr} />}
      </header>
    </>
  )
}

export default TopHeader

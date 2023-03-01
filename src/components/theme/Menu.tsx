import { Link } from "react-router-dom"
import classNames from "classnames"
import styles from "./Menu.module.scss"
import logout_icon from "../../images/icons/24-logout.png"
import useAddress from "../../hooks/useAddress"
import SimpleConnect from "../../layouts/SimpleConnect"
import { MenuKey } from "../../routes"
import { openTransak } from "../../pages/BuyUst"
const Menu = ({
  list,
  current,
  ext,
  sm,
}: {
  list: MenuItem[]
  isOpen?: boolean
  current?: string
  ext?: boolean
  sm?: boolean
  toggle?: () => void
}) => {
  const address = useAddress()
  return (
    <ul
      className={classNames(
        styles.menu,
        ext ? styles.ext_menu : "",
        sm ? styles.sm_menu : ""
      )}
    >
      {list.map(({ attrs, desktopOnly }) => {
        return (
          <li
            className={classNames(styles.item, { desktop: desktopOnly })}
            key={attrs.children}
          >
            {attrs.children !== MenuKey.PYLONRAISE &&
              attrs.children !== MenuKey.BUYUST && attrs.children !== MenuKey.MINELOOP && (
                <Link
                  to={attrs.to}
                  className={classNames(
                    styles.link,
                    current === attrs.to && styles.active
                  )}
                >
                  <img src={attrs.route_key} className={styles.icon} />
                  <img src={attrs.route_key1} className={styles.iconAct} />
                  <span className={styles.content}> {attrs.children}</span>
                </Link>
              )}

            {attrs.children === MenuKey.MINELOOP && (
              <a
                href="https://gateway.pylon.money/tokens/loop"
                target="_blank"
                rel="noreferrer"
                className={classNames(
                  styles.link,
                  styles.pylonLink,
                  current === attrs.to && styles.active
                )}
              >
                <img src={attrs.route_key ?? ""} className={styles.icon} />
                <img src={attrs.route_key1} className={styles.iconAct} />
                <span className={styles.content}> {attrs.children}</span>
              </a>
            )}

            {attrs.children === MenuKey.PYLONRAISE && (
              <a
                href="https://gateway.pylon.money/tokens/loop"
                target="_blank"
                rel="noreferrer"
                className={classNames(
                  styles.link,
                  styles.pylonLink,
                  current === attrs.to && styles.active
                )}
              >
                <img src={attrs.route_key ?? ""} className={styles.icon} />
                <img src={attrs.route_key1} className={styles.iconAct} />
                <span className={styles.content}> {attrs.children}</span>
              </a>
            )}
            {attrs.children === MenuKey.BUYUST && (
              <a
                onClick={() => {
                  openTransak()
                }}
                className={classNames(
                  styles.link,
                  styles.pylonLink,
                  current === attrs.to && styles.active
                )}
              >
                <img src={attrs.route_key ?? ""} className={styles.icon} />
                <img src={attrs.route_key1} className={styles.iconAct} />
                <span className={styles.content}> {attrs.children}</span>
              </a>
            )}
          </li>
        )
      })}
      {ext && (
        <li className={classNames(styles.item)}>
          <SimpleConnect customStyle={styles.connect}>
            <img src={logout_icon ?? ""} className={styles.icon} />{" "}
            {/* {!isOpen && ( */}
            <span className={address ? styles.connected : styles.disconnected}>
              {address ? "Disconnect" : "Connect Wallet"}
            </span>
            {/* )} */}
          </SimpleConnect>
        </li>
      )}
      {/* <li className={classNames(styles.link, styles.mob_disconnect)}>
        <SimpleConnect>
          {address ? "Disconnect Wallet" : "Connect Wallet"}
        </SimpleConnect>
      </li> */}
    </ul>
  )
}

export default Menu

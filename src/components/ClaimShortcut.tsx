import styles from "./ClaimShortcut.module.scss"
import {ReactNode, useState} from "react"
import { icons } from "../routes"
import LinkButton from "./LinkButton"
import Tooltip from "./Tooltip"

declare const window: any;


const ClaimShortcut = ({data, symbol, children}: { children: ReactNode, symbol: string, data: {
    symbol: string
    disable?: boolean
    path: string
  }[]}) => {

  const [isOpen] = useState<boolean>(false)
  const handleDataLayer=(symbol:string)=>
  {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
    'event':`airdrop_claim_${symbol}`,
    'event_category':'exchange',
    'event_action':`airdrop_claim_${symbol}`
  });



  }

  return !isOpen ? (
    <div className={styles.cardLoop}>
      <div className={styles.walletLoop}>
        <header className={styles.header}>
          <div className={styles.headerLoop}>
            <span className={styles.airdrop_icon}>
              <img src={icons["airdrop"]} alt={""} />
            </span>
            <span className={styles.description}>
                   { symbol } Airdrop
              {
                data && data.map((item)=>(
                  <>

                    {item.disable ? (
                        <LinkButton
                            to={"/"}
                            disabled={item.disable}
                            children={
                              <Tooltip
                                  content={`${item.symbol} airdrop will be announced when available`}
                              >
                                Claim {item.symbol}
                              </Tooltip>
                            }
                        />
                    ) : (
                        <LinkButton
                            to={item.path}
                            className={styles.claimButton}
                            children={`Claim ${item.symbol}`}
                            onClick={()=>handleDataLayer(item.symbol)}
                        />
                    )}
                  </>
                ))
              }
          </span>
            <span className={styles.airdrop_icon}>
                        <img src={icons["airLoopIconLeft"]} alt={""} />
                      </span>
          </div>
        </header>
        {
          children
        }
      </div>
    </div>
  ) : (
    <></>
  )
}

export default ClaimShortcut

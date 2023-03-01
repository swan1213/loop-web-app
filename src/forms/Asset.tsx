import { UST } from "../constants"
import { gt } from "../libs/math"
import {commas, format, lookupSymbol} from "../libs/parse"
import styles from "./Asset.module.scss"
import { AssetBalanceKey } from "../hooks/contractKeys"
import {changedIcons} from "../routes";
import classnames from "classnames";

interface Props extends AssetItem {
  formatTokenName?: (symbol: string) => string
  formatPairToken?: boolean | undefined
  balanceType?: AssetBalanceKey
  balanceSymbol?: string
  tokenSymbol: string
  showBalance?: boolean
}

const Asset = ({
  tokenSymbol,
  symbol,
  name,
  price,
  balance,
  formatTokenName,
  formatPairToken,
  balanceSymbol,
  showBalance,
  balanceType = AssetBalanceKey.BALANCE,
}: Props) => (
  <article className={styles.asset}>
    <header className={styles.header}>

      <h1 className={styles.symbol}>
        {
            tokenSymbol && changedIcons[tokenSymbol.toUpperCase()] && <img height={'30'} width={'30'} src={changedIcons[tokenSymbol.toUpperCase()] ?? ""} />
        }
        {formatTokenName?.(symbol) ??
          (formatPairToken ? symbol : lookupSymbol(symbol))}
      </h1>
    </header>

    <footer className={styles.footer}>
      {price && gt(price, 0) && name !== UST && (
        <p className={styles.price}>
          {format(price)} {UST}
        </p>
      )}

       {showBalance && (
          <p className={classnames(styles.balance, !gt(balance ?? "0", 0) ? styles.dimBalance : '')}>
          {" "}
          <strong>
            {balanceType
              ? `${commas(balance ?? "0")} ${balanceSymbol ? balanceSymbol : ""}`
              : format(balance, symbol)}
          </strong>
        </p>

       )

       }
    </footer>
  </article>
)

export default Asset

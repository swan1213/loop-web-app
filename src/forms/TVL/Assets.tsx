import { useState } from "react"
import classNames from "classnames/bind"
import { gt } from "../../libs/math"
import {
  useFetchTokens,
} from "../../hooks"
import Icon from "../../components/Icon"
import { Config } from "../useSelectAsset"
import Asset from "../Asset"
import styles from "./Assets.module.scss"
import {lookupSymbol} from "../../libs/parse"
import {useFindPairPoolPrice, useTokenMethods} from "../../data/contract/info"
import {useProtocol} from "../../data/contract/protocol"
import {useFindBalance} from "../../data/contract/normalize"

const cx = classNames.bind(styles)

interface Props extends Config {
  selected?: string
  onSelect: (token: string, symbol?: string) => void
  otherToken?: string
  selectedToken?: string
  formatPairToken?: boolean
}

const Assets = ({
  selected,
  onSelect,
  otherToken,
  selectedToken,
  ...props
}: Props) => {
  const { balanceKey } = props
  const { skip, dim, formatTokenName, formatPairToken } = props

  const { getName } = useProtocol()
  const { getSymbol } = useTokenMethods()
  const { contractList: listed, getOtherToken } = useFetchTokens(otherToken)
  const findBalanceFn = useFindBalance()
  const findPrice  = useFindPairPoolPrice()


  /* search */
  const [value, setValue] = useState("")
  const getItem = ({
    contract_addr,
    denom,
    tokenSymbol,
    tokenName,
    pair,
    lp,
  }: any): AssetItem => {
    const name =
      denom !== undefined
        ? lookupSymbol(denom)
        : getName(contract_addr)
        ? getName(tokenName)
        : tokenName ?? ""
    const symbol = denom
      ? lookupSymbol(denom)
      : getSymbol(contract_addr)
      ? getSymbol(contract_addr)
      : tokenSymbol ?? ""
    const otherToken = getOtherToken(pair ?? "", contract_addr)

    const balance = findBalanceFn(contract_addr ?? '') ?? "0"
    const price = findPrice?.(pair ?? '', contract_addr ?? '') ?? "0"

    return {
      symbol: formatPairToken
        ? `${symbol}-${
            otherToken?.isNative
              ? lookupSymbol(otherToken.denom)
              : getSymbol(otherToken?.contract_addr)
          }`
        : symbol,
      tokenSymbol,
      name: formatPairToken ? "" : name,
      token: formatPairToken ? lp : contract_addr,
      price: formatPairToken
        ? "0"
        : denom !== undefined
        ? denom
        : otherToken === undefined
        ? pair
          ? price
          : ""
        : "",
      balance: formatPairToken
        ? "0"
        : denom !== undefined
        ? denom
        : otherToken === undefined
        ? balance
        : "",
    }
  }

  /* list */
  const list: AssetItem[] =
    listed !== undefined
      ? [
          /*...insertIf(useUST, {
      token: UUSD,
      symbol: UUSD,
      name: UST,
      price: "1",
      balance: uusd,
    }),*/
          ...listed
            .map(getItem)
            .filter(({ symbol }) => !skip?.includes(symbol ?? "")),
        ]
      : []

  return (
    <div className={styles.component}>
      <section className={styles.search}>
        <label htmlFor="search">
          <Icon name="search" size={16} />
        </label>

        <input
          id="search"
          name="search"
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoFocus
        />
      </section>

      <ul className={classNames(styles.list)}>
        {list
          .filter(({ symbol, name }) =>
            // search result
            [symbol, name].some((text) =>
              text.toLowerCase().includes(value.toLowerCase())
            )
          )
          .sort(({ token: a }, { token: b }) => {
            const hasA =
              otherToken === undefined
                ? balanceKey && gt(findBalanceFn(a) ?? '0', 0)
                  ? 1
                  : 0
                : 0
            const hasB =
              otherToken === undefined
                ? balanceKey && gt(findBalanceFn(b) ?? '0', 0)
                  ? 1
                  : 0
                : 0
            return hasB - hasA
          })
          .map((item, index) => {
            const { token, symbol } = item
            const isSelected = token === selected
            const isDimmed = dim?.(token)

            return (
              <li key={`${token}~${index}`}>
                <button
                  type="button"
                  className={cx(styles.button, {
                    selected: isSelected,
                    dim: isDimmed,
                  })}
                  onClick={() => onSelect(token, symbol)}
                >
                  <Asset
                    {...item}
                    tokenSymbol={item.tokenSymbol ?? ""}
                    formatTokenName={formatTokenName}
                    formatPairToken={formatPairToken}
                  />
                </button>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default Assets

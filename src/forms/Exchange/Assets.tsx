import { useMemo, useState } from "react"
import classNames from "classnames/bind"
import { div, gt, multiple,lt } from "../../libs/math"
import { Config } from "../useSelectAsset"
import Asset from "../Asset"
import styles from "./Assets.module.scss"
import { isNative, lookupAmount, lookupSymbol } from "../../libs/parse"
import { ANC, LOOP, LOOPR, SMALLEST, UUSD, ULUNA, BLUNA, AUST, LUNA, UST } from "../../constants"
import { AssetBalanceKey } from "../../hooks/contractKeys"
import { useFindTokenDetails } from "../../data/form/select"
import { CONTRACT } from "../../hooks/useTradeAssets"
import { useFindBalance } from "../../data/contract/normalize"
import search from "../../images/searchv.png"
import { changedIcons } from "../../routes"
import {useFindPairPoolPrice} from "../../data/contract/info";

interface AssetItem {
  symbol: string
  tokenSymbol: string
  token: string
  name: string
  price?: string
  balance?: string
  pair: string
  lp: string
}

const cx = classNames.bind(styles)

interface Props extends Config {
  selected?: string
  onSelect: (token: string, symbol?: string) => void
  otherToken?: string
  selectedToken?: string
  formatPairToken?: boolean
  formatTokenName?: (symbol: string) => string
  showAsPairs?: boolean
  balanceType?: AssetBalanceKey
  listed: CONTRACT[]
  /** Exclude symbol in the list */
  skip?: string[]
  showQuickTokens?: boolean
  showBalance?: boolean
  showSearch?: boolean
}

const Assets = ({
  selected,
  onSelect,
  otherToken,
  selectedToken,
  listed,
                  skip,
                  showQuickTokens,
                  showBalance,
                  showSearch,
  ...props
}: Props) => {
  const { balanceType = AssetBalanceKey.BALANCE } = props
  const { dim, formatTokenName, formatPairToken } = props

  const findPairPoolPriceFn = useFindPairPoolPrice()
  const findBalanceFn = useFindBalance()
  const findTokenDetailFn = useFindTokenDetails()

  /* search */
  const [value, setValue] = useState("")

  const getItem = async ({
    denom,
    tokenSymbol,
    tokenName,
    lp,
    pair,
    token,
    secondToken,
    decimals,
  }: {
    contract_addr: string
    denom?: string
    tokenSymbol: string
    tokenName: string
    pair: string
    lp: string
    token: string
    secondToken?: string
    decimals?: number
  }) => {
    const otherTokenDetail = findTokenDetailFn(secondToken)

    const balance = {
      [AssetBalanceKey.BALANCE]:
        tokenSymbol && isNative(tokenSymbol)
          ? lookupAmount(multiple(findBalanceFn(token), SMALLEST)) ?? "0"
          : lookupAmount(findBalanceFn(token), decimals ?? 6),
      [AssetBalanceKey.LP]: div(findBalanceFn(lp) ?? "0", SMALLEST),
    }[balanceType]

    const symbolToken = formatPairToken
      ? `${lookupSymbol(tokenSymbol)}-${otherTokenDetail ? lookupSymbol(otherTokenDetail.tokenSymbol) : ""
      }`
      : lookupSymbol(tokenSymbol)

    const price = findPairPoolPriceFn?.(pair ?? "", token) ?? "0"

    return {
      symbol: symbolToken,
      tokenSymbol,
      name: formatPairToken ? "" : tokenName ?? "",
      token: formatPairToken ? lp : token,
      pair,
      lp,
      price: formatPairToken
        ? "0"
        : denom !== undefined
          ? denom
          : otherToken === undefined
            ? pair
              ? price
              : ""
            : "",
      balance: balance ? balance : "0",
      balanceSymbol: {
        [AssetBalanceKey.BALANCE]: undefined,
        [AssetBalanceKey.LP]: "LP",
      }[balanceType],
    }
  }

  const [lists, setLists] = useState<AssetItem[]>([])

  useMemo(() => {
    listed.filter((item)=> !skip?.includes(item.token)).map(getItem).map(async (item) => {
      const li = await item

      const exist = await lists.find((item) => item.token === li.token)

      if (!exist) {
        setLists((old) => [
          ...old.filter((item) => item.token !== li.token),
            li
        ])
      }
    })
  }, [listed])
  const loading = false

  return (
    <div
    >
    <div className={styles.component}>
     {showSearch && (
        <div className="AssetSearching">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoFocus
        />
        <button>
          <img src={search}  alt={'search'}/>
        </button>
      </div>
     )

     }
      { showQuickTokens && <div className="assetsValue">
        { lists
            .filter(({tokenSymbol}) =>
                [LOOP.toUpperCase(), UUSD.toUpperCase(), UST.toUpperCase()].includes(
                    tokenSymbol.toUpperCase()
                )
            )
            .map((item) => {
              return (
                  <span onClick={() => onSelect(item.token, item.pair)}>
                {changedIcons[item.tokenSymbol.toUpperCase()] && (
                    <img
                        height={"20"}
                        width={"20"}
                        src={changedIcons[item.tokenSymbol.toUpperCase()] ?? ""}
                    />
                )}
                    <b className={styles.quick_title}>{lookupSymbol(item.symbol)}</b>
              </span>
              )
            })}

        {
            showQuickTokens && lists
                .filter(
                    ({tokenSymbol}) =>
                        ![
                          LOOP.toUpperCase(),
                          UUSD.toUpperCase(),
                          UST.toUpperCase(),
                        ].includes(tokenSymbol.toUpperCase()) &&
                        [LOOPR, AUST, ULUNA, BLUNA, ANC, LUNA].includes(tokenSymbol.toUpperCase())
                )
                .map((item) => {
                  return (
                      <span onClick={() => onSelect(item.token, item.pair)}>
                  {changedIcons[item.tokenSymbol.toUpperCase()] && (
                      <img
                          height={"20"}
                          width={"20"}
                          src={changedIcons[item.tokenSymbol.toUpperCase()] ?? ""}
                      />
                  )}
                        <b className={styles.quick_title}>{lookupSymbol(item.symbol)}</b>
                </span>
                  )
                })}
      </div>
      }

      <ul className={classNames(styles.list, styles.scrollbar, { loading })}>
        {lists
          .filter(({ symbol, name }) =>
            // search result
            [symbol, name].some((text) =>
              text.toLowerCase().includes(value.toLowerCase())
            )
          )
          .sort(
            (
              { token: a, balance: aBalance },
              { token: b, balance: bBalance }
            ) => {
              const hasA = aBalance && gt(aBalance, "0") ? 1 : 0
              const hasB = bBalance && gt(bBalance, "0") ? 1 : 0
              return hasB - hasA
            }
          )
          .sort((a, b) => (lt(a.balance ? a.balance : 0, b.balance ? b.balance : 0) ? 1 : -1))
          .map((item, index) => {
            const { token, pair } = item
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
                  onClick={() => onSelect(token, pair)}
                >
                  <Asset
                    {...item}
                    tokenSymbol={item.tokenSymbol}
                    formatTokenName={formatTokenName}
                    formatPairToken={formatPairToken}
                    balanceType={balanceType}
                    showBalance={showBalance}
                  />
                </button>
              </li>
            )
          })}
      </ul>
    </div>
    </div>
  )
}

export default Assets

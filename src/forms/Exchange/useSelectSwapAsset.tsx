import { useEffect, useState } from "react"
import { PriceKey, BalanceKey, AssetBalanceKey } from "../../hooks/contractKeys"
import SelectAssetButton from "./SelectAssetButton"
import Assets from "./Assets"
import useAssetTokens from "../../hooks/Asset/useAssetTokens"
import {useTokenMethods} from "../../data/contract/info";

export interface Config {
  /** Current value */
  token: string
  /** Current symbol */
  symbol?: string
  /** first token value */
  otherToken?: string
  /** Function to call when a value is selected */
  onSelect: (asset: string, pair: string | undefined) => void
  /** Key of price to show from data */
  priceKey?: PriceKey
  /** Key of balance to show from data */
  balanceKey?: BalanceKey
  /** Include UST in the list */
  useUST?: boolean
  /** Exclude symbol in the list */
  skip?: string[]
  /** Modify token name */
  formatTokenName?: (symbol: string) => string
  formatPairToken?: boolean
  /** Condition to be dimmed */
  dim?: (token: string) => boolean
  shouldClose?: boolean
  showAsPairs?: boolean
  smScreen?: boolean
  balanceType?: AssetBalanceKey
  showQuickTokens?: boolean,
  showBalance?: boolean,
  showSearch?: boolean,
  type?: SelectType
  vertical?: boolean
  newFactory?: boolean
}

export enum SelectType {
  'SWAP'= 'SWAP',
  'POOL'= 'POOL'
}

export default (config: Config) => {
  const {
    token,
    symbol,
    onSelect,
    otherToken,
    shouldClose,
    showAsPairs,
    smScreen,
    skip,
    type,
    newFactory,
    vertical = false,
    showQuickTokens = true,
    showBalance = true,
    showSearch = true,
    balanceType = AssetBalanceKey.BALANCE,
  } = config
  const { getSymbol } = useTokenMethods()
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () =>
    isOpen ? handleSelect(token, symbol ?? "") : setIsOpen(!isOpen)
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [selectedToken, setSelectedToken] = useState("")
  const [isChanged, setIsChanged] = useState(false)
  const listed = useAssetTokens(otherToken, showAsPairs, type, newFactory)

  useEffect(() => {
    !isChanged && setTokenSymbol(symbol ? symbol : getSymbol(symbol))
    !isChanged && setSelectedToken(token)
  }, [symbol, token, getSymbol, isChanged])

  function resetIsChanged() {
    setIsChanged(false)
    setIsOpen(false)
  }

  /* select asset */
  const handleSelect = (token: string, pair?: string) => {
    onSelect(token, pair ?? undefined)
    setIsOpen(false)
    // setTokenSymbol(symbol ? symbol : getSymbol(symbol))
    setSelectedToken(token)
    setIsChanged(true)
    // If it is not reset it will not set again.
    resetIsChanged()
  }

  const select = {
    ...config,
    isOpen,
    symbol: shouldClose ? "" : symbol,
    onClick: toggle,
  }

  useEffect(() => {
    if (
      (shouldClose !== undefined || (token && token.length < 0)) &&
      otherToken !== undefined &&
      shouldClose
    ) {
      setIsOpen(false)
    }
  }, [shouldClose, token, otherToken])
  return {
    tokenSymbol,
    resetIsChanged,
    isOpen,
    button: <SelectAssetButton vertical={vertical} smScreen={smScreen} {...select} />,
    assets: isOpen ? (
      <>
        <Assets
          {...config}
          listed={listed}
          otherToken={otherToken}
          selected={shouldClose !== undefined && shouldClose ? "" : token ?? ''}
          onSelect={handleSelect}
          showAsPairs={showAsPairs}
          selectedToken={
            shouldClose !== undefined && shouldClose ? "" : selectedToken
          }
          balanceType={balanceType}
          showBalance={showBalance}
          skip={skip}
          showQuickTokens={showQuickTokens}
          showSearch={showSearch}
        />
      </>
    ) : undefined,
  }
}

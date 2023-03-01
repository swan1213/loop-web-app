import { useEffect, useState } from "react"
import { useContractsAddress } from "../../hooks"
import { PriceKey, BalanceKey } from "../../hooks/contractKeys"
import SelectAssetButton from "../SelectAssetButton"
import Assets from "./Assets"
import {useTokenMethods} from "../../data/contract/info";

export interface Config {
  /** Current value */
  token: string
  /** first token value */
  otherToken?: string
  /** Function to call when a value is selected */
  onSelect: (asset: string) => void
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
}

export default (config: Config) => {
  const { token, onSelect, otherToken, shouldClose } = config
  const { getSymbol } = useTokenMethods()
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => (isOpen ? handleSelect(token) : setIsOpen(!isOpen))
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [selectedToken, setSelectedToken] = useState("")

  /* select asset */
  const handleSelect = (token: string, symbol?: string) => {
    onSelect(token)
    setIsOpen(false)
    setTokenSymbol(symbol ? symbol : getSymbol(symbol))
    setSelectedToken(token)
  }

  const select = {
    ...config,
    isOpen,
    symbol: shouldClose ? "" : tokenSymbol ? tokenSymbol : getSymbol(token),
    onClick: toggle,
  }

  useEffect(() => {
    if (
      (shouldClose !== undefined || token.length < 0) &&
      otherToken !== undefined &&
      shouldClose
    ) {
      setIsOpen(false)
    }
  }, [shouldClose, token, otherToken])

  return {
    tokenSymbol,
    isOpen,
    button: <SelectAssetButton {...select} />,
    assets: isOpen ? (
      <Assets
        {...config}
        otherToken={otherToken}
        selected={shouldClose !== undefined && shouldClose ? "" : token}
        onSelect={handleSelect}
        selectedToken={
          shouldClose !== undefined && shouldClose ? "" : selectedToken
        }
      />
    ) : undefined,
  }
}

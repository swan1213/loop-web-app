import { FC } from "react"
import MESSAGE from "../lang/MESSAGE.json"
import { formatSelected, lookupSymbol } from "../libs/parse"
import Icon from "../components/Icon"
import { Config } from "./useSelectAsset"
import styles from "./SelectAsset.module.scss"

interface Props extends Config {
  isOpen: boolean
  symbol?: string
  onClick: () => void
  smScreen?: boolean
}

const SelectAsset: FC<Props> = ({
  isOpen,
  symbol,
  onClick,
  smScreen,
  ...props
}) => {
  const { formatTokenName = lookupSymbol } = props
  const getSymbol = (symbol: string) =>
    smScreen ? formatSelected(formatTokenName(symbol)) : formatTokenName(symbol)
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {symbol ? getSymbol(symbol) : MESSAGE.Form.Button.SelectAsset}
      <Icon name={isOpen ? "arrow_drop_up" : "arrow_drop_down"} size={24} />
    </button>
  )
}

export default SelectAsset

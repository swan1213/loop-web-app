import { useEffect, useState } from "react"
import useSelectSwapAsset from "../forms/Exchange/useSelectSwapAsset"
import { Key } from "../forms/PoolDynamicForm"
import { useFindLpTokens, useFindTokenDetails } from "../data/form/select"

const ComputeAllPairsChartHeader = ({ tokensDetail, setTokens }) => {
  const [pair, setPair] = useState<string | undefined>("")
  const findTokenDetailFn = useFindTokenDetails()
  const [isDropdown, setIsDropdown] = useState(false)

  const onSelect = (name: Key) => (token: string, pair: string | undefined) => {
    setPair(token)
    setIsDropdown(false)
  }

  const symbol = findTokenDetailFn(pair, "lp")?.tokenSymbol

  const findLpTokens = useFindLpTokens()

  const tokens = findLpTokens(pair)

  useEffect(() => {
    setTokens(tokens)
  }, [pair])

  const config = {
    token: pair,
    onSelect: onSelect(Key.token1),
    symbol: symbol,
    formatTokenName: undefined,
    formatPairToken: true,
    showAsPairs: true,
    showQuickTokens: false,
    showBalance: false,
    showSearch: true,
  }
  // @ts-ignore
  const select = useSelectSwapAsset({ ...config })

  return (
    <>
    {
      isDropdown &&
    <div style={{
      inset: 0,
      position: "absolute",
    }}
    onClick={() => setIsDropdown(false)}
    >

    </div>
    }
      <span onClick={() => setIsDropdown(true)}>{select.button}</span>

      {isDropdown && (
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute",
          background: '#252525',
          border: '1px solid #404040',
          borderRadius: '10px',
          marginTop:'12px'
        
        }}>{select.assets}</span>
        </div>
      )}
    </>
  )
}

export default ComputeAllPairsChartHeader

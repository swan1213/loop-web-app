import { div } from "../../libs/math"
import { adjustAmount, format, formatAsset, isNative, lookupSymbol } from "../../libs/parse"
import { Type } from "../../pages/Exchange"
import { findValue } from "./receiptHelpers"
import {useRecoilValue} from "recoil"
import { useTokenMethods } from "../../data/contract/info"
import {findLpTokenInfo} from "../../data/contract/normalize"
import {TxLog} from "../../types/tx"


export default (type: Type, simulatedPrice?: string) => (logs: TxLog[]) => {
  const getTokenSymbol = useRecoilValue(findLpTokenInfo);
  const { getSymbol } = useTokenMethods()
  const { check8decOper } = useTokenMethods()
  const val = findValue(logs)

  const offer = val("offer_amount")
  const offerAsset = val("offer_asset")
  const rtn = val("return_amount")
  const rtnAsset = val("ask_asset")
  const spread = val("spread_amount")
  const commission = val("commission_amount")


  const rtnSymbol = getSymbol(rtnAsset)
  const offerSymbol = getTokenSymbol(offerAsset)?.symbol ?? ""

  const price = div(offer,rtn )


  // const slippage = minus(div(price, simulatedPrice), 1)


  /* contents */
  const priceContents = {
    [Type.SWAP]: {
      title: `Price per ${lookupSymbol(rtnSymbol)}`,
      content: `${format(check8decOper(offerAsset) ? adjustAmount(true, true, price) :  price)} ${lookupSymbol(offerSymbol)}`,
      children: [{ title: "Slippage", content: "-" }],
    },
    [Type.SELL]: {
      title: `Price per ${lookupSymbol(offerSymbol)}`,
      content: `${format(check8decOper(rtnAsset) ? adjustAmount(true, true, price) :  price)} ${lookupSymbol(rtnSymbol)}`,
      children: [{ title: "Slippage", content: "-" }],
    },
  }[type]

  const rtnContents = {
    title: { [Type.SWAP]: "Bought", [Type.SELL]: "Earned" }[type],
    content: formatAsset(check8decOper(rtnAsset) ? adjustAmount(true, true, rtn) :  rtn, rtnSymbol),
    children: [
      { title: "Spread", content: formatAsset(check8decOper(rtnAsset) ? adjustAmount(true, true, spread) : spread , rtnSymbol) },
      { title: "Commission", content: formatAsset(check8decOper(rtnAsset) ? adjustAmount(true, true, commission) : commission, rtnSymbol) },
    ],
  }

  const offerContents = {
    title: { [Type.SWAP]: "Paid", [Type.SELL]: "Sold" }[type],
    content: formatAsset(check8decOper(offerAsset) ? adjustAmount(true, true, offer) : offer, isNative(offerAsset) ?  offerAsset : offerSymbol),
  }

  return {
    [Type.SWAP]: [priceContents, rtnContents, offerContents],
    [Type.SELL]: [priceContents, offerContents, rtnContents],
  }[type]
}

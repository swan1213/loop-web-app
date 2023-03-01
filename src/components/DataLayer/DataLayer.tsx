import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"

declare const window: any

interface Props {
  asset?: string
  receipt?: any
  txFee?: string
  txHash?: string
}

const DataLayer = ({ asset, receipt, txFee, txHash }: Props) => {
  const dataLayer = (window.dataLayer = window.dataLayer || [])

  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname == "/swap") {
      dataLayer.push({
        event: "swap",
        event_category: "exchange",
        event_action: "swap",
        event_label: asset, //the pair of assets
        event_value: receipt && receipt[1].children[1].content, //commission of the swap as revenue
        tx_hash: txHash, // transaction id
        value_from: receipt && receipt[2]?.content,
        value_to: receipt && receipt[1]?.content,
        slippage: 0,
        tx_fee: txFee,
        spread: receipt && receipt[1]?.children[0]?.content,
      })
    }
    if (pathname == "/pool") {

        const symbols= receipt[1]?.content.split('+');
        const symbol1=symbols[0]?.trim()?.substr(symbols[0]?.indexOf(" ") + 1)
        const symbol2=symbols[1]?.trim()?.split(' ');            

      dataLayer.push({
        event: "pool",
        event_category: "exchange",
        event_action: "pool",
        event_label: (symbol1 &&  symbol1)+'_'+(symbol2 && symbol2[1]), //the pair of assets
        tx_fee: txFee, //tx_fee deposited value
        tx_hash: txHash,
        value_received: receipt[0]?.content,
        value_deposited: receipt[1]?.content,
      })
    }
    if (pathname == "/stake") {

      // console.log("receipt",receipt);

      const label=receipt && receipt[0]?.content;
      const asset=label.split(' ');

      dataLayer.push({
        event:'stake',
        event_category:'exchange',
        event_action:'stake',
        event_label:asset[1], //the pair of assets 
        tx_fee: txFee, //tx_fee value
        tx_hash:txHash,
        amount: asset[0]
        });
        
  }
    if (pathname == "/farm2") {

      // console.log("receipt",receipt);


      const value = receipt[0]?.content.substr(
        0,
        receipt[0]?.content.indexOf(" ")
      ) 
      const symbol = receipt[0]?.content.substr(
        receipt[0]?.content.indexOf(" ") + 1
      ) 
      dataLayer.push({
        event: "farm",
        event_category: "exchange",
        event_action: "farm",
        event_label: symbol, //the symbol
        event_value: value, //the actual value of LP tokens
        tx_hash:txHash,
        tx_fee:txFee
      })
    }
  }, [])

  return <div></div>
}

export default DataLayer

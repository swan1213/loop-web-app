import { gql } from "@apollo/client"

export const CONNECT = gql`
  mutation connect($address: String!) {
    connect(address: $address) {
      address
    }
  }
`

export const STATISTICS = gql`
  query statistic($from: Float!, $to: Float!, $network: Network) {
    statistic(network: $network) {
      assetMarketCap
      totalValueLocked {
        total
        liquidity
        collateral
      }
      collateralRatio
      latest24h {
        transactions
        volume
        feeVolume
        mirVolume
      }

      liquidityHistory(from: $from, to: $to) {
        timestamp
        value
      }

      tradingVolumeHistory(from: $from, to: $to) {
        timestamp
        value
      }
    }
  }
`

export const ASSETSTATS = gql`
  query assets($network: Network) {
    assets {
      token
      description
      statistic {
        liquidity(network: $network)
        volume(network: $network)
        apr
        apy
      }
    }
  }
`

export const PRICEHISTORY = gql`
  query asset(
    $token: String!
    $interval: Float!
    $from: Float!
    $to: Float!
    $yesterday: Float!
  ) {
    asset(token: $token) {
      prices {
        price
        priceAt(timestamp: $yesterday)

        history(interval: $interval, from: $from, to: $to) {
          timestamp
          price
        }
      }
    }
  }
`
export const ASSETPRICEHISTORY = gql`
    query($token: String!, $interval: Float!, $from: Float!, $to: Float!, $second_token: String!) {  
        getHistory(token: $token, interval: $interval, from: $from, to: $to, second_token: $second_token) {
          timestamp
          price
        }
    }
`
export const ASSETPRICE = gql`
    query($token: String!, $second_token: String!) {  
        getPrice(token: $token,second_token: $second_token)
    }
`

export const ASSETPRICEAT = gql`
    query($token: String!, $second_token: String!, $timestamp: Float!) {  
        getPriceAt(token: $token,second_token: $second_token, timestamp: $timestamp)
    }
`

export const VOLUME24HOURS = gql`
     query {
       last24HoursVolume
      }
    
`
export const VOLUME7DAYS = gql`
     query {
      last7DaysVolume
      }
    
`
export const VOLUMETOTAL = gql`
     query {
      totalVolume
      }
    
`

const alias = (
  token: string,
  timestamp: number
) => `${token}: asset(token: "${token}") {
      prices {
        priceAt(timestamp: ${timestamp})
        oraclePriceAt(timestamp: ${timestamp})
      }
    }`

export const prices = (tokens: string[], timestamp: number) => gql`
  query {
    ${tokens.map((token) => alias(token, timestamp))}
  }
`

const assetWithUstPriceAlias = (
  token: string,
  second_token: string
) => `${token}: getPrice(token: "${token}", second_token: "${second_token}")`

export const AssetWithUstPrice = (tokens: {token: string, second_token: string}[] | undefined) => gql`
  query {
    ${tokens ? tokens.map(({token, second_token}) => assetWithUstPriceAlias(token, second_token)) : ''}
  }
`
/*
 * TVL for top trading asset
 */
export const pairTVLAlias = (
  lpToken: string,
  token: string,
  second_token: string
) => `${lpToken}: tokenTotalLockedValue(token: "${token}", second_token: "${second_token}") {
    token
    second_token
    liquidity 
 }
 `

export const getPairTVLMap = (items) => gql`
  query {
    ${items.map((item) =>  pairTVLAlias(item.lpToken, item.token, item.second_token))}
  }
`

export const PairTVLQuery = (tokens) => gql`
  query {
    ${tokens && tokens.length ? tokens.map(({token, second_token, lpToken}) => pairTVLAlias(lpToken, token, second_token)) : pairTVLAlias("zeoi", "uusd", "uusd")}
  }
`

export const assetPriceHistory = ({ token, from, interval, second_token, to}:{token: string, from: string, to: string, interval: number, second_token: string}) => gql`
    query {  
        getHistory(token: ${token}, interval: ${interval}, from: ${from}, to: ${to}, second_token: ${second_token}) {
          timestamp
          price
        }
    }
`

export const TXINFOS = gql`
  query($hash: String) {
    TxInfos(TxHash: $hash) {
      Height
      TxHash
      Success
      RawLog

      Tx {
        Fee {
          Amount {
            Amount
            Denom
          }
        }
        Memo
      }

      Logs {
        Events {
          Type
          Attributes {
            Key
            Value
          }
        }
      }
    }
  }
`
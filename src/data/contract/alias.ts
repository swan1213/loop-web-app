import { gql } from "graphql-request"
import { WASMQUERY } from "../../constants"

interface Query extends Partial<ContractVariables> {
  name: string
}

export interface QueryTrade {
  name: string,
  contract_addr: string,
  second_token: string,
}

export interface QuerySevenDayFee {
    name: string,
    token: string,
    second_token: string,
}

interface QueryVolumeByPair {
  name: string,
  contract: string
}

const getDocument = ({ name, contract, msg }: Query) =>
  !msg
    ? ``
    : `
    ${name}: ${WASMQUERY}(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`

export default (queries: Query[], name: string) => gql`
  query ${name} {
    ${queries.map(getDocument)}
  }
`


const getDocumentForTradeQuery = ({ name, contract_addr, second_token }: QueryTrade) =>
  !contract_addr
    ? ``
    : `
    ${name}: getPriceAtTwentyNWeekQuery(
      token: "${contract_addr}",
      second_token: "${second_token}"
    ){
    twentyhours
    aWeek
    }`

export const tradeQueryAlias = (queries: QueryTrade[], name: string) => gql`
  query ${name} {
    ${queries.map(getDocumentForTradeQuery)}
  }
`


const getDocumentForVolumeByPairQuery = ({ name, contract }: QueryVolumeByPair) =>
  !contract
    ? ``
    : `
    ${name}: getVolumeByPair7Days(
      token: "${contract}"
    )`

const getDocumentForTotalVolumeByPairQuery = ({ name, contract }: QueryVolumeByPair) =>
    !contract
        ? ``
        : `
    ${name}: getTotalVolumeByPair(
      token: "${contract}"
    )`

export const getVolumeByPairAlias = (queries: QueryVolumeByPair[], name: string) => gql`
  query ${name} {
    ${queries.map(name === 'getVolumeByPairQuery' ? getDocumentForVolumeByPairQuery : getDocumentForTotalVolumeByPairQuery)}
  }
`


export const stringify = (msg: object) =>
  JSON.stringify(msg).replace(/"/g, '\\"')

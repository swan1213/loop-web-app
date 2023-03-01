import {CONTRACT, PAIR} from "../hooks/useTradeAssets"

type GetDocument = (item: ListedItem) => ContractVariables | undefined
interface ContractVariables {
  contract: string
  msg: object
}

type ContractData = { Height: string; Result: string }
interface WasmResponse {
  WasmContractsContractAddressStore: ContractData | null
}

type GetTokenInfoDocument = (item: CONTRACT) => ContractVariables | undefined
type getDistributedRewardaInPoolDocument = (item: string, lpToken: string) => ContractVariables | undefined
type GetStakingDocument = (item: string) => ContractVariables | undefined

type GetPairTVLDocument = (item: PAIR) => { token: string, lpToken: string, second_token: string} | undefined
type GetPairsDocument = (item: string) => ContractVariables | undefined

type GetQueryTradeDocument = (item: CONTRACT) => { contract_addr: string, second_token: string} | undefined
type GetQuerySevenDayFeeDocument = (pair: string, token?: string, secondToken?: string) => { name: string,  token: string, second_token: string} | undefined
type GetVolumeByPairDocument = (item: CONTRACT) => { contract: string } | undefined

// farming
type GetDevTokenDocument = (item: string) => {
  contract: string
  msg: object
  name: string
}
| undefined
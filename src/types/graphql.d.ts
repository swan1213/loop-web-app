interface ContractVariables {
  contract: string
  msg: object
}

type ContractData = { Height: string; Result?: string } | null
interface ContractsData {
  WasmContractsContractAddressStore: ContractData
}
type TradeQuery = { twentyhours: string, aWeek: string} | null

type VolumeByPairQuery = string | null

type ContractsType = {
  address: string
} | null
interface TxInfos {
  TxInfos: TxInfo[]
}

export interface TxInfoItem {
  Success: boolean
  RawLog: string

  TxHash: string

  Tx: {
    Fee: { Amount: FeeAmount[] }
    Memo: string
  }

  Logs: TxLog[]
}

export interface TxInfo {
  Success: boolean
  RawLog: string

  TxHash: string

  Tx: {
    Fee: { Amount: FeeAmount[] }
    Memo: string
  }

  Logs: TxLog[]
}

interface FeeAmount {
  Amount: string
  Denom: string
}

interface TxLog {
  Events: TxEvent[]
}

interface TxEvent {
  Attributes: Attribute[]
  Type: string
}

interface Attribute {
  Key: string
  Value: string
}

/* Tax */
interface TaxData {
  TreasuryTaxCapDenom: {
    Result: string
  }
  TreasuryTaxRate: {
    Result: string
  }
}

interface Tax {
  rate?: string
  cap?: string
}

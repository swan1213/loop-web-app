import {useRecoilValue} from "recoil";
import {stakedByUserQuery} from "../../data/contract/migrate";

export interface STAKED {
  amount: string
  asset: { token: { contract_addr: string } }
}

export const useStakedByUser = (
  token: string,
  contract: string,
  address: string
): { value: STAKED[] | undefined } => {
  const value = useRecoilValue(stakedByUserQuery({token, contract: contract ?? "", address}))

  return {
    value,
  }
}

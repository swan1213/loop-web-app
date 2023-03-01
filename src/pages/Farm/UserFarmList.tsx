import { gt } from "../../libs/math";
import FarmStake from "../../components/FarmStake";
import {TxResult} from "@terra-money/wallet-provider";
import {PostError} from "../../forms/FormContainer";
import {DATASOURCE} from "./TopFarming";
import {Type} from "../Stake";
import {useFarmPage, FarmType} from "../FarmBeta";
import FarmStakeFarm2 from "../../components/FarmStakeFarm2";
import FarmUserStakeV4 from "../../components/Farm/FarmUserStakeV4";


const UserFarmList = ({farmResponseFun, dataSource}:{ dataSource: DATASOURCE[], farmResponseFun: (
      res: TxResult | undefined,
      errors: PostError | undefined,
      type?: string
  ) => void
}) => {
    const farmPage = useFarmPage()
    const type = Type.UNSTAKE

  return (
      <>
        {
            dataSource && dataSource.length > 0 && dataSource
              .filter((farm) => gt(farm.staked ?? "0", "0"))
              .map((farm) => (
                      farmPage === FarmType.farm ? <FarmStake
                      type={type}
                      hidden={false}
                      key={farm.lpToken}
                      farmResponseFun={farmResponseFun}
                      dataSource={farm}
                      farmContractType={farm.FarmContractType}
                  /> : farmPage === FarmType.farm3 ? <FarmUserStakeV4
                          type={type}
                          hidden={false}
                          key={farm.lpToken}
                          farmResponseFun={farmResponseFun}
                          dataSource={farm}
                          farmContractType={farm.FarmContractType}
                      /> : <FarmStakeFarm2
                      type={type}
                      hidden={false}
                      key={farm.lpToken}
                      farmResponseFun={farmResponseFun}
                      dataSource={farm}
                      farmContractType={farm.FarmContractType}
                  />
              ))
        }
      </>
  )
}

export default UserFarmList

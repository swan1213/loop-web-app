import CollapsibleTable from "../../components/CollapsibleTable"
import {getICon2} from "../../routes"
import { TxResult } from "@terra-money/wallet-provider"
import { PostError } from "../../forms/FormContainer"
import { Info } from "../../hooks/Farm/useFarmingList"
import { ReactNode } from "react"
import styles from "./AdminTopFarming.module.scss"
import {bound} from "../../components/Boundary";
import {commas, decimal} from "../../libs/parse";
import {SMALLEST} from "../../constants";
import {div} from "../../libs/math";
import {FarmContractTYpe} from "../../data/farming/FarmV2";
import { ApyTooltipIcon } from "../../components/ApyToolTip"
import FarmApyTooltipContent from "../../components/FarmApyTooltipContent"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder";

export interface DATASOURCE {  
  token: string
  symbol: string
  lpToken: string
  contract_addr: string
  staked?: string
  apr?: string
  pending?: string
  liquidity?: string
  tokens?: Info[]
  rewards?: ReactNode
  rewards_beta?: ReactNode
  all_apr?: ReactNode
  call_user_liquidity?: ReactNode
  farm?: ReactNode
  FarmContractType: FarmContractTYpe
    tx_fee_apy?: ReactNode
    all_apy?: ReactNode
}

const AdminTopFarming = ({
                      farmResponseFun,
                      dataSource,
                      hidden = true,
                    }: {
  farmResponseFun: (
      res: TxResult | undefined,
      errors: PostError | undefined,
      type?: string
  ) => void
  dataSource: DATASOURCE[]
  hidden?: boolean
}) => {

  return <CollapsibleTable
                columns={[
                  /*  {
                        key: "rank",
                        title: "No.",
                        render: (_value, _record, index) => index + 1,
                    },*/
                    {
                        key: "symbol",
                        title: "Farm",
                        render: (_value, _record) => {
                            return (
                                <div className={styles.icontable}>
                                    <div className={styles.icontableHub}>
                                        <img
                                            style={{ width: "30px", borderRadius: "25px" }}
                                            src={getICon2(_value.split("-")[0].trim().toUpperCase())}
                                            alt=" "
                                        />
                                        <img
                                            style={{ width: "30px", borderRadius: "25px" }}
                                            src={getICon2(_value.split("-")[1].trim().toUpperCase())}
                                            alt=" "
                                        />
                                    </div>
                                    <p style={{ display: "block" }}>{_value}</p>
                                </div>
                            )

                        }
                    },
                    {
                        key: "all_rewards",
                        title: "Rewards",
                        render: (value) => bound(value, <LoadingPlaceholder />)
                    },
                    {
                        key: "loopRewards",
                        title: "7 Day Reward in Ust",
                        render: (value) => bound('$' + commas(value), <LoadingPlaceholder />)
                    },
                    {
                        key: "lp_balance",
                        title: "Your Unstaked LP",
                        render: (value) => bound(commas(decimal(div(value, SMALLEST), 3)), <LoadingPlaceholder />)
                    },
                    /*{ key: "all_staked", title: "Total Staked" },
                    { key: "staked", title: "User Staked" },*/
                    {
                        key: "all_apy",
                        title: "Combined APY",
                        render: (value, {all_apr, tx_fee_apy,symbol}) => bound(<ApyTooltipIcon content={<><FarmApyTooltipContent symbol={symbol} apy={value}  tx_fee_apy={tx_fee_apy}  apr={all_apr}/></>}><span className={styles.blue}>{bound(value, "fetching...")}</span> </ApyTooltipIcon>, <LoadingPlaceholder /> )
                    },
                    {
                        key: "call_liquidity",
                        title: "TVL",
                        render: (value) => bound(value, <LoadingPlaceholder />)
                    }
                ]}
                dataSource={dataSource}
                hidden={hidden}
                farmResponseFun={farmResponseFun}
            />
}

export default AdminTopFarming

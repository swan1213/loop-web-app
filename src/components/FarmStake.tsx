import styles from "./FarmStake.module.scss"
import Card from "./Card"
import Grid from "./Grid"
import Price from "./Price"
import Button from "./Button"
import { useEffect, useState } from "react"
import plus_icon from "../images/icons/24 expand plus.svg"
import collapsed from "../images/icons/24-expand minus.svg"
import classNames from "classnames"
import Modal from "./Modal"
import { DATASOURCE } from "../pages/Farm/TopFarming"
// import useRewardByDistributionToken from "../graphql/queries/Farm/useRewardByDistributionToken"
import FarmStakeForm from "../forms/Farm/FarmStakeForm"
import { Type as StakeType } from "../pages/Stake"
import { TxResult } from "@terra-money/wallet-provider"
import { PostError } from "../forms/FormContainer"
import {div, gt, number} from "../libs/math";
import {decimal} from "../libs/parse";
import Tooltip from "./Tooltip";
import useRewardNextPayout from "../graphql/queries/Farm/useRewardNextPayout";
import useUnstakedTimeout from "../graphql/queries/Farm/useUnstakedTimeout";
import {useFindUsersStakedTime} from "../data/farming/stakeUnstake";
import {FarmType} from "../pages/FarmBeta";
import Boundary from "./Boundary";
import Loader from "react-loader-spinner"
import {FarmContractTYpe} from "../data/farming/FarmV2";

interface Props {
  farmResponseFun: (res: TxResult | undefined, errors: PostError | undefined, type?: string) => void,
  dataSource: DATASOURCE,
  hidden?: boolean,
  type: StakeType,
  pageName?: FarmType
  farmContractType: FarmContractTYpe
}

const FarmStake = ({type, dataSource, farmResponseFun, hidden = true, pageName, farmContractType}: Props) => {

  const [token, setToken] = useState('')
  const [lpToken, setLpToken] = useState('')
  const [expand, setExpand] = useState(false)
  const [symbol, setSymbol] = useState('')
  const [isOpenStakeModal, setIsOpenStakeModal] = useState(false)
  const [stakeDefaultType, setStakeDefaultType] = useState(StakeType.STAKE)

  useEffect(()=>{
    if(dataSource) {
      !token && setToken(dataSource?.token)
      !token && setSymbol(dataSource?.symbol)
      !token && setLpToken(dataSource?.lpToken)
    }
  },[dataSource, token])

  // get reward for claimable by LpToken
  // const userClaimable = useRewardByDistributionToken(lpToken ?? "")

  const parsePrice = (price: string, def: string) => price !== undefined ? decimal(price, 2) : def

  const modalTitle = {
    [StakeType.STAKE]: "Stake LP",
    [StakeType.UNSTAKE]: "Unstake LP",
  }[stakeDefaultType]

  const openStakeModal = (
    type: StakeType
  ): any => {
    setIsOpenStakeModal(!isOpenStakeModal)
    setStakeDefaultType(type)
  }

  const closeStakeModal = () => {
    setIsOpenStakeModal(!isOpenStakeModal)
  }
  const collapsedIcon = <img src={expand ? collapsed : plus_icon} alt={expand ? '-' : '+'} className={styles.expand_icon} onClick={()=> setExpand(!expand)} />

  const { formatTime, timeString, timeLeft } = useRewardNextPayout()
  const findUserStakedTimeFn = useFindUsersStakedTime()
  const { timeLeft: timeLeftUnstake, timeString: timeStringUnstake, formatTime: formatTimeUnstake } = useUnstakedTimeout(
      findUserStakedTimeFn?.(lpToken)
  )

  // @ts-ignore
  return (
    <div>
      <Card className={classNames(styles.main, expand ? '' : styles.slim)} >
        <Grid className={styles.stake_container} onClick={()=> setExpand(!expand)}>
          <Grid className={classNames(styles.cell, styles.mobile_cell)}>
            <Grid className={classNames(styles.selection, styles.symbol_title)}>
                {symbol}
            </Grid>
            <Grid className={classNames(expand ? styles.expanded : styles.closed, styles.stake_btn)}>
              <Button disabled={true} className={styles.stake_unstake_btn} onClick={()=> {}}>{hidden  ? <Tooltip content={"Please stake in Live Farm"}> + Stake</Tooltip> : ' + Stake'}</Button>
              {/*<Button disabled={hidden} className={styles.stake_unstake_btn} onClick={()=> hidden ? {} :openStakeModal(StakeType.STAKE)}> + Stake</Button>*/}
              <Button className={styles.stake_unstake_btn} onClick={()=> openStakeModal(StakeType.UNSTAKE)}>- Unstake & Claim</Button>
            </Grid>
            <Grid className={styles.collapsed_mobile_icon}>
              {collapsedIcon}
            </Grid>
          </Grid>
          <Grid  className={styles.cell}>
            <Grid>
              <div className={styles.content}>
                <h3>APY</h3>
                <h2>{dataSource.all_apr}</h2>
              </div>
            </Grid>
            <Grid>
              <Grid className={classNames(expand ? styles.expanded : styles.closed)}>
                <div  className={styles.content}>
                  <h3>Rewards</h3>
                  <Boundary
                      fallback={
                        <div className="dashboardLoader">
                          <Loader type="Oval" color="white" height={50} width={50} />
                        </div>
                      }
                  >
                  <h2 >{dataSource?.rewards}</h2>
                  </Boundary>
                  <Grid className={styles.payoutContainer}>
                    {
                      timeLeft && timeString.length > 0 ?
                          <span className={styles.payoutSection}>{timeString && gt(number(timeLeft), "0") && <span
                              className={styles.timeLeft}>Next Reward :</span>}{formatTime && gt(number(timeLeft), "0") ? ` ${formatTime}` : ''}</span> :
                          <span>(Few days left)</span>
                    }
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid  className={styles.cell}>
            <Grid>
              <div  className={styles.content}>
                <h3>Total Locked (compounded)</h3>
                <h2><Price price={dataSource && dataSource.staked  ? parsePrice(dataSource.staked, '0') ?? "0" : "0"} symbol={'LP + Rewards'} classNames={styles.value} />{/* (1% of pool)*/}</h2>
              </div>
            </Grid>
            <Grid>
              <div className={styles.content}>
                <h3><b>Min Stake Period</b></h3>
                <h2>
                    {timeLeftUnstake && timeStringUnstake.length > 0 ? (
                        <span className={styles.timeLeftSection}>
                          {formatTimeUnstake && gt(number(timeLeftUnstake), "0") ? `${formatTimeUnstake}` : ""}
                        </span>
                    ) : (
                        <span>(Few days left)</span>
                    )}
                </h2>
              </div>
            </Grid>
            {/*<Grid className={classNames(expand ? styles.expanded : styles.closed)}>
              <div  className={styles.content}>
                <h3>LP vs HODL APY</h3>
                <h2><Price price={dataSource && dataSource.apr ? `+${parsePrice(dataSource.apr, '0')}%` ?? "0%" : "0%"} classNames={styles.value} /></h2>
              </div>
            </Grid>*/}
          </Grid>
          <Grid  className={styles.cell}>
            <Grid>
              <div  className={styles.content}>
                <h3>Total Value</h3>
                <h2>{dataSource.call_user_liquidity}</h2>
              </div>
            </Grid>
          </Grid>
          <Grid  className={styles.cell} >
            <Grid>
              {collapsedIcon}
            </Grid>
          </Grid>
        </Grid>
      </Card>
      <Modal isOpen={isOpenStakeModal} title={modalTitle} onClose={closeStakeModal}>
        {stakeDefaultType && lpToken && token && farmContractType && (
          <FarmStakeForm
            type={stakeDefaultType}
            token={token}
            lpToken={lpToken}
            farmResponseFun={farmResponseFun}
            partial
            key={type}
            pageName={pageName}
           farmContractType={farmContractType}/>
        )}
      </Modal>
    </div>
  )
}

export default FarmStake

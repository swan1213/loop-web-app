import styles from "./FarmStake.module.scss"
import Card from "./Card"
import Grid from "./Grid"
import Price from "./Price"
import Button from "./Button"
import {useEffect, useState} from "react"
import plus_icon from "../images/icons/24 expand plus.svg"
import collapsed from "../images/icons/24-expand minus.svg"
import classNames from "classnames"
import Modal from "./Modal"
import {DATASOURCE} from "../pages/Farm/TopFarming"
// import useRewardByDistributionToken from "../graphql/queries/Farm/useRewardByDistributionToken"
import FarmStakeForm from "../forms/Farm/FarmStakeForm"
import {Type as StakeType} from "../pages/Stake"
import {TxResult} from "@terra-money/wallet-provider"
import {PostError} from "../forms/FormContainer"
import {div, gt, number} from "../libs/math";
import {commas, decimal} from "../libs/parse";
import Tooltip from "./Tooltip";
import {useRewardNextPayoutFarm2} from "../graphql/queries/Farm/useRewardNextPayout";
import {useUnstakeTimoutFarm2} from "../graphql/queries/Farm/useUnstakedTimeout";
import {FarmType} from "../pages/FarmBeta";
import Boundary, {bound} from "./Boundary";
import Loader from "react-loader-spinner"
import {FarmContractTYpe, useFindUsersStakedTimeFarm2} from "../data/farming/FarmV2";
import {getICon2} from "../routes";
import {skipedPairs} from "../hooks/Asset/useAssetTokens";
import LoadingPlaceholder from "./Static/LoadingPlaceholder";

interface Props {
  farmResponseFun: (res: TxResult | undefined, errors: PostError | undefined, type?: string) => void,
  dataSource: DATASOURCE,
  hidden?: boolean,
  type: StakeType,
  pageName?: FarmType
  farmContractType: FarmContractTYpe
}

const FarmStakeFarm2 = ({type, dataSource, farmResponseFun, pageName, farmContractType, hidden = true}: Props) => {

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

  const parsePrice = (price: string, def: string) => price !== undefined ? commas(decimal(price, 2)) : def

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

  const { formatTime, timeString, timeLeft } = useRewardNextPayoutFarm2(farmContractType)
  const findUserStakedTimeFn = useFindUsersStakedTimeFarm2(farmContractType)
  const { timeLeft: timeLeftUnstake, timeString: timeStringUnstake, formatTime: formatTimeUnstake } = useUnstakeTimoutFarm2(
      findUserStakedTimeFn?.(lpToken), farmContractType, lpToken
  )

  // @ts-ignore
  return (
    <div>
      <Card className={classNames(styles.main, expand ? '' : styles.slim)} >
        <Grid className={styles.stake_container} onClick={()=> setExpand(!expand)}>
          <Grid className={classNames(styles.cell, styles.mobile_cell)}>
            <Grid className={classNames(styles.selection, styles.symbol_title)}>
              <div className={styles.icontable}>
                <div className={styles.icontableHub}>
                  { symbol.split("-")[0] && <img
                      style={{ width: "25px", borderRadius: "25px" }}
                      src={getICon2(symbol.split("-")[0].trim().toUpperCase())}
                      alt=" "
                  />}
                  { symbol.split("-")[1] && <img
                      style={{ width: "25px", borderRadius: "25px" }}
                      src={getICon2(symbol.split("-")[1].trim().toUpperCase())}
                      alt=" "
                  /> }
                </div>
                <p style={{ display: "block" }}>{symbol}</p>
              </div>
                {/*{symbol}*/}
            </Grid>
            <Grid className={classNames(expand ? styles.expanded : styles.closed, styles.stake_btn)}>
              <Button disabled={hidden} className={styles.stake_unstake_btn} onClick={()=> (hidden) ? {} :openStakeModal(StakeType.STAKE)}>{hidden ? <Tooltip content={"only for beta users"}> + Stake</Tooltip> : ' + Stake'}</Button>
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
                <h2>{bound(dataSource.all_apy, <LoadingPlaceholder size={'sm'} color={'black'} />)}</h2>
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
                      bound(timeLeft && timeString.length > 0 ?
                          <span className={styles.payoutSectionFarm2}>{timeString && gt(number(timeLeft), "0") && <span>next reward:</span>}{formatTime && gt(number(timeLeft), "0") ? ` ${formatTime}` : ''}</span> :
                          <span>(Few days left)</span>, <LoadingPlaceholder size={'sm'} color={'black'} />)
                    }
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid  className={classNames(styles.cell, styles.maxCell)}>
            <Grid>
              <div  className={styles.content}>
                <h3>Total Locked</h3>
                <h2>{bound(<Price price={dataSource && dataSource.staked  ? parsePrice(dataSource.staked, '0') ?? "0" : "0"} symbol={'LP'} classNames={styles.value} />, <LoadingPlaceholder size={'sm'} color={'black'} />)}{/* (1% of pool)*/}</h2>
              </div>
            </Grid>
            <Grid>
              <div className={styles.content}>
                <h3>Next Rewards</h3>
                <h2 >{bound(dataSource?.rewards_beta, <LoadingPlaceholder size={'sm'} color={'black'} />)}</h2>
                <small>*your estimated rewards over the next hour</small>
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
                <h2>{bound(dataSource.call_user_liquidity, <LoadingPlaceholder size={'sm'} color={'black'} />)}</h2>
              </div>
            </Grid>
            { (timeLeftUnstake && timeStringUnstake.length > 0 && gt(timeLeftUnstake, "0")) && <Grid>
              <div className={styles.content}>
                <h3>Min Stake Period</h3>
                <h2>
                  {bound(timeLeftUnstake && timeStringUnstake.length > 0 ? (
                      <span className={styles.timeLeftSection}>
                          {formatTimeUnstake && gt(number(timeLeftUnstake), "0") ? `${formatTimeUnstake}` : ""}
                        </span>
                  ) : (
                      <span>(Few days left)</span>
                  ), <LoadingPlaceholder size={'sm'} color={'black'} />)}
                </h2>
              </div>
            </Grid>
            }
          </Grid>
          <Grid  className={styles.cell} >
            <Grid className={styles.collapsedIcon}>
              {collapsedIcon}
            </Grid>
          </Grid>
        </Grid>
      </Card>
      <Modal isOpen={isOpenStakeModal} title={modalTitle} onClose={closeStakeModal}>
        {stakeDefaultType && lpToken && token && (
          <FarmStakeForm
            type={stakeDefaultType}
            token={token}
            lpToken={lpToken}
            farmResponseFun={farmResponseFun}
            partial
            key={type}
            pageName={pageName}
            isOpen={isOpenStakeModal}
            farmContractType={farmContractType}
          />
        )}
      </Modal>
    </div>
  )
}

export default FarmStakeFarm2

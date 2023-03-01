import {TxResult} from "@terra-money/wallet-provider"
import {useEffect, useState} from "react"
import classnames from "classnames"
import Loader from "react-loader-spinner"

import styles from "./FarmUserStakeV4.module.scss"
import Card from "../Card"
import Grid from "../Grid"
import Price from "../Price"
import Button from "../Button"
import Modal from "../Modal"
import {DATASOURCE} from "../../pages/Farm/TopFarming"
import FarmStakeForm from "../../forms/Farm/FarmStakeForm"
import {Type as StakeType} from "../../pages/Stake"
import {PostError} from "../../forms/FormContainer"
import {div, gt, number} from "../../libs/math"
import {commas, decimal} from "../../libs/parse"
import {useLockTimeFrameForAutoCompound, useUnstakeTimoutFarm2} from "../../graphql/queries/Farm/useUnstakedTimeout"
import {FarmType} from "../../pages/FarmBeta"
import Boundary, {bound} from "../Boundary"
import {
  FarmContractTYpe,
  useFindUsersStakedTimeFarm2
} from "../../data/farming/FarmV2"
import {getICon2} from "../../routes"
import LoadingPlaceholder from "../Static/LoadingPlaceholder"
import plus_btn_icon from "../../images/plus.svg"
import minus_btn_icon from "../../images/minus.svg"
import plus_icon from "../../images/icons/24 expand plus.svg"
import collapsed from "../../images/icons/24-expand minus.svg"
import AutoCompoundBtn from "./AutoCompoundBtn";
import {useGetUserAutoCompoundSubriptionFarm4} from "../../data/contract/migrate";

interface Props {
  farmResponseFun: (res: TxResult | undefined, errors: PostError | undefined, type?: string) => void,
  dataSource: DATASOURCE,
  hidden?: boolean,
  type: StakeType,
  pageName?: FarmType
  farmContractType: FarmContractTYpe
}

const FarmUserStakeV4 = ({type, dataSource, farmResponseFun, pageName, farmContractType, hidden = true}: Props) => {

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

  const parsePrice = (price: string, def: string) => price !== undefined ? commas(decimal(price, 4)) : def

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
  const {contents: findAutoCompundStatus} = useGetUserAutoCompoundSubriptionFarm4(farmContractType)
  const disabled =  findAutoCompundStatus[lpToken] ?? false
  // console.log("disabled", findAutoCompundStatus, lpToken, findAutoCompundStatus[lpToken])
  // const { formatTime, timeString, timeLeft } = useRewardNextPayoutFarm2(farmContractType)
  const findUserStakedTimeFn = useFindUsersStakedTimeFarm2(farmContractType)
  const { timeLeft: timeLeftUnstake, timeString: timeStringUnstake, formatTime: formatTimeUnstake } = useUnstakeTimoutFarm2(
      findUserStakedTimeFn?.(lpToken), farmContractType, lpToken
  )

  const { timeLeft: timeLeftUnstakeCompound, timeString: timeStringUnstakeCompound, formatTime: formatTimeUnstakeCompound } = useLockTimeFrameForAutoCompound(
      findUserStakedTimeFn?.(lpToken), farmContractType
  )

  // @ts-ignore
  return (
    <div>
      <Card className={classnames(styles.container, expand ? '' : styles.slim)} mainSectionClass={styles.main} >
        <Grid className={styles.stake_container} onClick={()=> setExpand(!expand)}>
          <Grid className={classnames(styles.cell, styles.mobile_cell)}>
            <Grid className={classnames(styles.selection, styles.symbol_title)}>
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
                <p style={{ display: "block" }} className={styles.symbol}>{symbol}</p>
              </div>
            </Grid>
            <Grid className={classnames(expand ? styles.expanded : styles.closed, styles.stake_btn)}>
              <div className={classnames(styles.grid, styles.comboBtnContainer)}>
                <Button disabled={hidden} className={classnames(styles.stake_unstake_btn, styles.smBtn)} onClick={()=> (hidden) ? {} :openStakeModal(StakeType.STAKE)}><img src={plus_btn_icon} height={'20px'} alt={'+'} /></Button>
                <Button className={classnames(styles.stake_unstake_btn, styles.smBtn)} onClick={()=> openStakeModal(StakeType.UNSTAKE)}><img src={minus_btn_icon} height={'20px'} alt={'-'} /></Button>
                <Button className={classnames(styles.stake_unstake_btn, styles.harvestBtn, styles.disabled)} disabled={true} onClick={()=>{}}>Harvest</Button>
              </div>
              <div className={classnames(styles.grid, styles.comboBtnContainer)}>
                <AutoCompoundBtn lp={lpToken} farmContractType={farmContractType} farmResponseFun={farmResponseFun} />
              </div>
            </Grid>
            <Grid className={styles.collapsed_mobile_icon}>
              {collapsedIcon}
            </Grid>
          </Grid>
          <Grid  className={styles.cell}>
            <Grid className={styles.row}>
              <div className={styles.content}>
                <h3>APY</h3>
                <h2>{bound(dataSource.all_apy, <LoadingPlaceholder size={'sm'} color={'black'} />)}</h2>
              </div>
            </Grid>
            <Grid className={styles.row}>
              <Grid className={classnames(styles.expanded)}>
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
                  {/*<Grid className={styles.payoutContainer}>
                    {
                      bound(timeLeft && timeString.length > 0 ?
                          <span className={styles.payoutSection}>{timeString && gt(number(timeLeft), "0") && <span>next reward:</span>}{formatTime && gt(number(timeLeft), "0") ? ` ${formatTime}` : ''}</span> :
                          <span>(Few days left)</span>, <LoadingPlaceholder size={'sm'} color={'black'} />)
                    }
                  </Grid>*/}
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid  className={classnames(styles.cell, styles.maxCell)}>
            <Grid  className={styles.row}>
              <div  className={styles.content}>
                <h3>Total Locked</h3>
                <h2>{bound(<Price price={dataSource && dataSource.staked  ? parsePrice(dataSource.staked, '0') ?? "0" : "0"} symbol={'LP'} classNames={styles.value} />, <LoadingPlaceholder size={'sm'} color={'black'} />)}{/* (1% of pool)*/}</h2>
              </div>
            </Grid>
            <Grid  className={styles.row}>
              <div className={styles.content}>
                <h3>Next Rewards</h3>
                <h2 >{bound(dataSource?.rewards_beta, <LoadingPlaceholder size={'sm'} color={'black'} />)}</h2>
                <small>*your estimated rewards over the next hour</small>
              </div>
            </Grid>
            {/*<Grid className={classnames(expand ? styles.expanded : styles.closed)}>
              <div  className={styles.content}>
                <h3>LP vs HODL APY</h3>
                <h2><Price price={dataSource && dataSource.apr ? `+${parsePrice(dataSource.apr, '0')}%` ?? "0%" : "0%"} classnames={styles.value} /></h2>
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
            { disabled ?  ((timeLeftUnstakeCompound && timeStringUnstakeCompound.length > 0 && gt(timeLeftUnstakeCompound, "0")) && <Grid>
              <div className={styles.content}>
                <h3>Min Stake Period (compound)</h3>
                <h2>
                  {bound(timeLeftUnstakeCompound && timeStringUnstakeCompound.length > 0 ? (
                      <span className={styles.timeLeftSection}>
                          {formatTimeUnstakeCompound && gt(number(timeLeftUnstakeCompound), "0") ? `${formatTimeUnstakeCompound}` : ""}
                        </span>
                  ) : (
                      <span>(Few days left)</span>
                  ), <LoadingPlaceholder size={'sm'} color={'black'} />)}
                </h2>
              </div>
            </Grid>) : ((timeLeftUnstake && timeStringUnstake.length > 0 && gt(timeLeftUnstake, "0")) && <Grid>
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
            </Grid>)
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

export default FarmUserStakeV4

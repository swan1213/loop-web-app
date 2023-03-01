import {css} from "@emotion/react"
import {TxResult} from "@terra-money/wallet-provider"
import ClipLoader from "react-spinners/ClipLoader"

import Boundary, {bound} from "../../components/Boundary"
import Card from "../../components/Card"
import classNames from "classnames"
import { UST } from "../../constants"
import styles from "../../components/FarmStake.module.scss"
import {div, gt, number, lt, minus, plus} from "../../libs/math"
import UserFarmList from "./UserFarmList"
import {TopFarmingFarm4} from "./TopFarming"
import { useFarmsNewList} from "./useFarmBetaList"
import {PostError} from "../../forms/FormContainer"
import {FarmType, useFarmPage} from "../FarmBeta"
import LinkButton from "../../components/LinkButton"
import {getPath, MenuKey} from "../../routes"
import FarmRules from "../../components/FarmRules"
import LoadingPlaceholder from "../../components/Static/LoadingPlaceholder"
import {useRewardNextPayoutFarm2} from "../../graphql/queries/Farm/useRewardNextPayout"
import {FarmContractTYpe} from "../../data/farming/FarmV2"
import {commas, decimal} from "../../libs/parse"

const Farm4Page = ({farmResponseFun}:{farmResponseFun: (
        res: TxResult | undefined,
        errors: PostError | undefined,
        type?: string
    ) => void}) => {

    const dataSource = useFarmsNewList(true)

    const color = '#FFFFFF'
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: white;
    `
    const farmPage = useFarmPage()
    const { formatColorTime, timeLeft, timeColorString } = useRewardNextPayoutFarm2(FarmContractTYpe.Farm4)
    const totalValue = dataSource && dataSource.length > 0 ? dataSource.map((item)=> item.totalValueUst).reduce((a, b) => plus(a, b), 0) : "0"

    return (<>
            <FarmRules/>
            { (dataSource && dataSource.length > 0 && dataSource
                .filter((farm) => gt(farm.staked ?? "0", "0")).length > 0) && <div className={styles.mainSectionLooping}>
                <div className={styles.headingLooping}>
                    <h1 className={styles.cardTitle}>
                        Your Farming
                    </h1>

                    <h1 className={styles.paddLeftRight}>
                        <div className={styles.cardDetail}>
                            <p className={styles.title}>
                                NEXT REWARD IN
                            </p>
                            <p>
                                {
                                    bound(timeLeft && formatColorTime.length > 0 ?
                                        <span className={styles.payoutSection}>{formatColorTime && gt(number(timeLeft), "0") ? (
                                            timeColorString && timeColorString.map((item, index) => <> {item} { lt(index, minus(timeColorString.length, "1")) && <span className={styles.timeColon}>:</span>}</>)
                                        ) : ''}</span> :
                                        <span>(Few days left)</span>, <LoadingPlaceholder size={'sm'} color={'black'} />)
                                }
                            </p>
                        </div>
                        <div className={styles.cardDetail}>
                            <p className={styles.title}>
                                TOTAL VALUE
                            </p>
                            <p className={styles.value}>
                                {
                                    commas(decimal(totalValue, 6))
                                } <span className={styles.static}>{ UST }</span>
                            </p>
                        </div>
                    </h1>
                </div>
                <div className={styles.stakeBottom}>
                    <Boundary
                        fallback={
                            <Card className={classNames(styles.container, styles.slim)}>
                                <div className="dashboardLoaderInline">
                                    <ClipLoader
                                        color={color}
                                        loading={true}
                                        css={override}
                                        size={50}
                                    />
                                </div>
                            </Card>
                        }
                    >
                        <UserFarmList dataSource={dataSource} farmResponseFun={farmResponseFun}/>
                    </Boundary>
                </div>
            </div>
            }
            <Card
                title={farmPage === FarmType.farm ? <span>Farm Beta (New and improved farming <LinkButton className={styles.simpleLink} to={getPath(MenuKey.FARMBETA)}><u>Here</u></LinkButton>)</span> : "Farm"}
                title_description={
                    <>
                        {
                            [FarmType.farm, FarmType.farm2].includes(farmPage) && (<p>
                                How Farming Works:
                            </p>)
                        }
                        {
                            farmPage === FarmType.farm && <>
                                <p>- Rewards start accumulating immediately.</p>
                                <p>- Rewards are auto-compounded and are based on the value of your staked LP plus your
                                    unclaimed rewards.</p>
                                <p>- There is a 1 week minimum staking period before rewards can be claimed, but you can
                                    withdraw at any time.</p>
                                <p>- If you stake more LP at any time the 1 week timer will be reset.</p>
                                <p>- All farming pools will be live by Friday 19th November.</p>
                                <p>- Our farming contracts have been audited internally and by a third party. The
                                    official TFL audit is still in progress.</p>
                            </>
                        }
                        { farmPage === FarmType.farm2 && (
                            <>
                                <p>- Rewards start accumulating immediately.</p>
                                <p>- Rewards are now distributed hourly.</p>
                                <p>- Estimated rewards over the next hour are now visible.</p>
                                <p>- There is a 1 week minimum staking period before rewards can be claimed, but you can withdraw at any time.</p>
                                <p>- If you stake more LP at any time the 1 week timer will be reset.</p>
                                <p>- Our farming contracts have been audited internally and by a third party. The official TFL audit is still in progress.</p>
                            </>
                        )
                        }

                    </>
                }
            >
                <TopFarmingFarm4
                    hidden={false}
                    farmResponseFun={farmResponseFun}
                    dataSource={dataSource}
                />
            </Card>
            {/*</Boundary>*/}

            {/*{disconnect && (
            <Button
              className="mobile"
              onClick={disconnect}
              color="secondary"
              outline
              block
              submit
            >
              Disconnect
            </Button>
          )}*/}
        </>
    )
}

export default Farm4Page

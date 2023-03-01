import Boundary from "../../components/Boundary";
import Card from "../../components/Card";
import classNames from "classnames";
import styles from "../../components/FarmStake.module.scss";
import {div} from "../../libs/math";
import ClipLoader from "react-spinners/ClipLoader";
import UserFarmList from "./UserFarmList";
import TopFarming from "./TopFarming";
import {useFarmsList} from "./useFarmBetaList"
import {css} from "@emotion/react"
import {TxResult} from "@terra-money/wallet-provider"
import {PostError} from "../../forms/FormContainer"
import {FarmType, useFarmPage} from "../FarmBeta"
import LinkButton from "../../components/LinkButton"
import {getPath, MenuKey} from "../../routes"

const FarmPage = ({farmResponseFun}:{farmResponseFun: (
        res: TxResult | undefined,
        errors: PostError | undefined,
        type?: string
    ) => void}) => {

    const dataSource = useFarmsList(true)
    
    const color = '#FFFFFF'
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: white;
    `
    const farmPage = useFarmPage()

    return (<>
            {/*<FarmRules/>*/}
            <Boundary
                fallback={
                    <Card className={classNames(styles.main, styles.slim)} >
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
                <UserFarmList dataSource={dataSource} farmResponseFun={farmResponseFun} />
            </Boundary>
            <Card
                title={farmPage === FarmType.farm ? <span>Farm Beta (New and improved farming <LinkButton className={styles.simpleLink} to={getPath(MenuKey.FARMBETA)}><u>Here</u></LinkButton>)</span> : "Farm"}
                title_description={
                    <>
                        <p>
                            How Farming Works:
                        </p>
                        {
                            farmPage === FarmType.farm && <>
                                <p>- Rewards start accumulating immediately.</p>
                                <p>- Rewards are auto-compounded and are based on the value of your staked LP plus your unclaimed rewards.</p>
                                <p>- There is a 1 week minimum staking period before rewards can be claimed, but you can withdraw at any time.</p>
                                <p>- If you stake more LP at any time the 1 week timer will be reset.</p>
                                <p>- All farming pools will be live by Friday 19th November.</p>
                                <p>- Our farming contracts have been audited internally and by a third party. The official TFL audit is still in progress.</p>
                            </>
                        }

                        {
                            farmPage === FarmType.farm2 && (
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
                <TopFarming
                    hidden={false}
                    farmResponseFun={farmResponseFun}
                    dataSource={dataSource}
                    showMigrate={true}
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

export default FarmPage

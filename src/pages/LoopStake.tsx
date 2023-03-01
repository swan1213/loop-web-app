import { TxResult } from "@terra-money/wallet-provider"
import { Helmet } from "react-helmet"
import Sound from "react-sound"
import { useRecoilValue } from "recoil"

import {SMALLEST} from "../constants"
import Page from "../components/Page"
import Container from "../components/Container"
import styles from "./LoopStake.module.scss"
import Grid from "../components/Grid"
import {div, multiple} from "../libs/math"
import { useState } from "react"
import Result from "../forms/Result"
import { PostError } from "../forms/FormContainer"
import Modal from "../components/Modal"
import useClaimReceipt from "../forms/receipts/useClaimReceipt"
import { useLOOPPrice } from "../data/contract/normalize"
import { getTokensDistributedPerDayQuery } from "../data/airdrop/airdrop"
import useStakingReceipt from "../forms/receipts/useStakingReceipt"
import Summary from "../components/Summary"
import { TooltipIcon } from "../components/Tooltip"
import iconLogo2 from "../images/icons/totalProfit.svg"
import StakeDurationCard from "./Stake/StakeDurationCard"
import loop_icon from "../images/coins/loop_icon.svg"
import {bound} from "../components/Boundary"
import StakeCards from "./Stake/StakeCards"
import LoadingPlaceholder from "../components/Static/LoadingPlaceholder";
import classnames from "classnames";
import useHash from "../libs/useHash"

export enum Type {
  "STAKE" = "stake",
  "UNSTAKE" = "unstake",
}
export enum TypeLabels {
  "STAKE" = "Earn LOOP",
  "UNSTAKE" = "unstake",
}
export enum StakeDuration{
  "12MON" ="12MON",
  "18MON" ="18MON",
  "3MON" ="3MON",
}

const LoopStake = () => {

  const soundfile =
      "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-remove-2576.mp3"

  const [audioPlay, setIsPlaying] = useState(false)

  // const [isOpenModal, setIsOpenModal] = useState(false)
  const [isHelpOpenModal, setIsHelpOpenModal] = useState(false)
  const closeModalHelp = () => setIsHelpOpenModal(!isHelpOpenModal)

  const [response, setResponse] = useState<TxResult | undefined>()
  const [harvestResponse, setHarvestResponse] = useState<TxResult | undefined>()
  const [error, setError] = useState<PostError | undefined>()
  const handleSongPlaying = () => {
    setIsPlaying(true)
  }
  const handleSongFinishedPlaying = () => {
    setIsPlaying(false)
  }
  const farmResponseFun = (
      res: TxResult | undefined = undefined,
      err: PostError | undefined = undefined
  ) => {
    if (res) {
      setResponse(res)
    }
    if (err) {
      setError(err)
    }
  }

  const reset = () => {
    setError(undefined)
    setResponse(undefined)
    setHarvestResponse(undefined)
  }

  /* result */
  const parseTx = useStakingReceipt(null)
  const parseClaimTx = useClaimReceipt()

  // const progress = <div className={styles.filled} style={{ width: `${10}%` }} />
  const { contents: loopPrice } = useLOOPPrice();

  return (
      <Page>
        <Helmet>
          <title>Loop Markets | Stake</title>
        </Helmet>
        <Sound
            url={soundfile}
            playStatus={audioPlay ? "PLAYING" : "STOPPED"}
            onPlaying={handleSongPlaying}
            onFinishedPlaying={handleSongFinishedPlaying}
        />
        {response || error ? (
            <Container sm>
              <Result
                  response={response}
                  error={error}
                  parseTx={parseTx}
                  onFailure={reset}
                  gov={false}
              />
            </Container>
        ) : harvestResponse || error ? (
            <Container sm>
              <Result
                  response={harvestResponse}
                  error={error}
                  parseTx={parseClaimTx}
                  onFailure={reset}
                  gov={false}
              />
            </Container>
        ) : (
            <>
            <div className={styles.flex}>
              {/* <ClaimShortcut farmResponseFun={farmResponseFun} /> */}
              <section className={styles.content}>
                {/*<Card title="Your Airdrops" className={styles.airdrop_container}>
              <div className={styles.your_liquidity_content}>
                {!!dataSource && (
                  <Table
                    columns={[
                      {
                        key: "date",
                        title: "Date",
                      },
                      {
                        key: "amount",
                        title: "Amount",
                      },
                      { key: "value", title: "Value" },
                      {
                        key: "collected",
                        title: "Collected?",
                        render: (value) => {
                          return <div className={styles.collected}>
                            <img src={value ? yes_icon : no_icon} alt={value ? 'yes' : 'no'}
                                 className={styles.icon} alt={''} /> {value ? "Yes" : "No"}
                          </div>
                        },
                      },
                    ]}
                    dataSource={dataSource}
                  />
                )}
              </div>
            </Card>*/}
              </section>
              {/*<section className={styles.chart}>
                <Container sm className={styles.form_container}>
                  {type && (
                      <LoopStakeFarm
                          type={type}
                          token={token}
                          tab={tab}
                          tabLabels={tabLabels}
                          farmResponseFun={farmResponseFun}
                          key={type}
                          className={styles.form_container}
                          gov
                      />
                  )}
                  <Card title="Your Deposits" className={styles.harvest_container}>
                    <div className={styles.your_liquidity_content}>
                      <Grid className={styles.deposit_stats}>
                        <div className={classnames(styles.deposit_stat, styles.large_section)}>
                          <label>Next Reward</label>
                          { <CalculatRewardPerSecond total_staked={div(totalTokenStaked, SMALLEST)} user_staked={div(deposited12Mon, SMALLEST)}/>}
                          <span className={styles.small}>*your estimated rewards over the next 24hrs</span>
                        </div>
                        <div className={styles.deposit_stat}>
                          <label>Your Rewards</label>
                          <Price
                              price={numbers(decimal(multiple(div(userRewardsQuery ?? "0", SMALLEST), loopPrice), 3))}
                              symbol={"UST"}
                              classNames={styles.prices}
                          />
                          <span className={styles.small}>{div(userRewardsQuery ?? "0", SMALLEST)} {LOOP}</span>
                          {
                              gt(nextTimeLeft, "0") && (
                                  <span className={styles.small}>Next rewards: {nextTimeLeft && nextTimeString.length > 0 ? (
                                      <span className={styles.timeLeftSection}>
                                    {nextFormatTime && gt(number(nextTimeLeft), "0") ? `${nextFormatTime}` : ""}
                          </span>
                                  ) : (
                                      <span>(Few days left)</span>
                                  )}</span>
                              )
                          }
                        </div>
                        <div className={styles.claim_section}>
                          <Button
                              disabled={true}
                              size={"md"}
                              className={classnames(
                                  styles.md_btn,
                                  styles.unstake_btn
                              )}
                              onClick={() => setIsOpenModal(true)}
                          >
                            {" "}
                            <img
                                src={icons["minus"]}
                                alt={"minus"}
                                className={styles.icon}
                                height={20}
                                width={20}
                            />{" "}
                            UNSTAKE
                            & CLAIM
                          </Button>
                          <Modal
                              isOpen={isOpenModal}
                              title={modalTitle}
                              onClose={closeModal}
                          >
                            {getToken(LOOP) && (
                                <LoopUnStakeFarm
                                    type={Type.UNSTAKE}
                                    token={getToken(LOOP)}
                                    farmResponseFun={farmResponseFun}
                                    key={type}
                                    gov={true}
                                />
                            )}
                          </Modal>
                        </div>
                      </Grid>
                      <Grid className={styles.deposit_stats}>
                        <div className={styles.deposit_stat}>
                          <label>Deposited</label>
                          <Price
                              price={numbers(div(deposited12Mon ?? "0", SMALLEST))}
                              symbol={"LOOP"}
                              classNames={styles.prices}
                          />
                        </div>
                        <div className={styles.deposit_stat}>
                          <label>Total Value</label>
                          <Price
                              price={numbers(decimal(multiple(div(deposited12Mon ?? "0", SMALLEST), loopPrice), 2))}
                              symbol={UST}
                              classNames={styles.prices}
                          />
                        </div>
                        <div className={styles.deposit_stat}>
                          <label>Min. Staked Period</label>
                          <div className={styles.min_stake_time}>
                            {timeLeft && shortTimeString.length > 0 ? (
                                <span className={styles.timeLeftSection}>
                                    {shortFormatTime && gt(number(timeLeft), "0") ? `${shortFormatTime}` : ""}
                          </span>
                            ) : (
                                <span>(Few days left)</span>
                            )}
                          </div>
                        </div>
                      </Grid>
                    </div>
                  </Card>
                </Container>
              </section>*/}
            </div>
              <div className={styles.newStakeHub}>
                <section className={styles.newStake}>
                  <Grid className={styles.CzcardGrid}>
                    <StakeCards />

                    {/*<Card className={styles.card}>
                      <Summary
                          labelClassName={styles.label}
                          icon={earned}
                          title={
                            <TooltipIcon
                                className={styles.tooltipNew}
                                content="sample"
                            >
                              Total Claimable
                            </TooltipIcon>
                          }
                      >
                         <Count
                      integer
                      className={styles.count}
                      priceClass={styles.price}
                    >
                      24 hrs
                    </Count>
                        <span className={styles.count}>4,899.10</span>
                        <span className={styles.price}>LOOP</span>
                        <i>5,287.21 UST</i>
                      </Summary>
                    </Card>*/}

                    {/*<Card className={styles.card}>
                      <Summary
                          labelClassName={styles.label}
                          icon={iconLogo1}
                          title={
                            <TooltipIcon
                                className={styles.tooltipNew}
                                content="sample"
                            >
                              Total Staked Balance
                            </TooltipIcon>
                          }
                      >
                         <Count
                      integer
                      className={styles.count}
                      priceClass={styles.price}
                    >
                      24 hrs
                    </Count>
                        <span className={styles.count}>4,899.10</span>
                        <span className={styles.price}>LOOP</span>
                        <i>4,987.21 UST</i>
                      </Summary>
                    </Card>*/}

                    {/*<Card className={styles.card}>
                      <Summary
                          labelClassName={styles.label}
                          icon={iconLogo1}
                          title={
                            <TooltipIcon
                                className={styles.tooltipNew}
                                content="sample"
                            >
                              Total Stakable
                            </TooltipIcon>
                          }
                      >
                         <Count
                      integer
                      className={styles.count}
                      priceClass={styles.price}
                    >
                      24 hrs
                    </Count>
                        <span className={styles.count}>4,899.10</span>
                        <span className={styles.price}>LOOP</span>
                        <i>4,987.21 UST</i>
                      </Summary>
                    </Card>*/}

                    {/*<Card className={styles.card}>
                      <Summary
                          labelClassName={styles.label}
                          icon={iconLogo3}
                          title={
                            <TooltipIcon
                                className={styles.tooltipNew}
                                content="sample"
                            >
                              Staking Ratio
                            </TooltipIcon>
                          }
                      >
                         <Count
                      integer
                      className={styles.count}
                      priceClass={styles.price}
                    >
                      24 hrs
                    </Count>
                        <span className={styles.count}>4,899.10</span>
                        <span className={styles.price}>UST</span>
                      </Summary>
                    </Card>*/}

                  </Grid>
                </section>
                <section className={styles.stakeLoopRight}>
                  {/*<StakePlaceholder />*/}
                  { bound(<StakeDurationCard loopPrice={loopPrice} duration={StakeDuration["12MON"]} farmResponseFun={farmResponseFun} />, <StakePlaceholder />)}
                  { bound(<StakeDurationCard loopPrice={loopPrice} duration={StakeDuration["18MON"]} farmResponseFun={farmResponseFun} />, <StakePlaceholder />)}
                  { bound(<StakeDurationCard loopPrice={loopPrice} duration={StakeDuration["3MON"]} farmResponseFun={farmResponseFun} />, <StakePlaceholder /> ) }

                  {/*<div className={styles.mainSectionLooping}>
                    <div className={styles.headingLooping}>
                      <h1>Stake LOOP - 6 Month
                         <span onClick={() => setIsHelpOpenModal(true)}><img src={terms}/></span>
                      </h1>
                      <h1 className={styles.paddLeftRight}>
                        <b>15%</b>{" "}
                        <p>
                          {" "}
                          APR{" "}
                          <label className={styles.loopingValues}>
                            {" "}
                            <b>3.7m</b> LOOP TVL{" "}
                          </label>
                        </p>
                      </h1>
                      <h1 className={styles.paddLeftRight}>
                        <section>
                          <div>1</div> <b>M</b>
                          <div>1</div>
                          <div>2</div> <b>D</b>
                          <div className={styles.colorChange}>1</div>
                          <div className={styles.colorChange}>0</div> <b>H</b>
                          <div className={styles.colorChange}>2</div>
                          <div className={styles.colorChange}>3</div> <b>M</b>
                        </section>
                      </h1>
                    </div>
                    <div className={styles.stakeBottom}>
                      <div className={styles.stakeBottom1}>
                        <section>
                          <img src={iconLogo} />
                          <p>30,000 <i>LOOP</i></p><b>per day</b>
                        </section>
                      </div>
                      <div className={styles.stakeBottom1 + " paddLeftRight"}>
                        <label>
                          Next Reward
                          <p>
                            30.677 <span>LOOP</span>
                            <i>1,287.21 LOOP</i>
                            <i>*your estimated rewards over 24hrs</i>
                          </p>
                        </label>
                        <button onClick={() => setIsStakeOpenModal(true)}>
                          <b>+</b> STAKE
                        </button>
                      </div>
                      <div className={styles.stakeBottom1 + " paddLeftRight"}>
                        <label>
                          Your Rewards
                          <p>
                            207.07 <span>LOOP</span>
                            <i>1,287.21 UST</i>
                            <i>next reward: 9m 23s</i>
                          </p>
                        </label>
                        <button onClick={() => setIsUnstakeOpenModal(true)}>
                          <b>-</b> UNSTAKE & CLAIM
                        </button>
                      </div>
                      <div className={styles.stakeBottom1}>
                        <label>
                          My Staked Balance
                          <p>
                            29.091492 <span>UST</span>
                            <i>1,287.21 LOOP</i>
                          </p>
                        </label>
                        <label>
                          Deposited
                          <p>29.091492 <span>LOOP</span>
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={styles.mainSectionLooping}>
                    <div className={styles.headingLooping}>
                      <h1>Stake LOOP - 3 Month
                         <span onClick={() => setIsHelpOpenModal(true)}><img src={terms}/></span>
                      </h1>
                      <h1 className={styles.paddLeftRight}>
                        <b>15%</b>{" "}
                        <p>
                          {" "}
                          APR{" "}
                          <label className={styles.loopingValues}>
                            {" "}
                            <b>3.7m</b> LOOP TVL{" "}
                          </label>
                        </p>
                      </h1>
                      <h1 className={styles.paddLeftRight}>
                        <section>
                          <div>1</div> <b>M</b>
                          <div>1</div>
                          <div>2</div> <b>D</b>
                          <div className={styles.colorChange}>1</div>
                          <div className={styles.colorChange}>0</div> <b>H</b>
                          <div className={styles.colorChange}>2</div>
                          <div className={styles.colorChange}>3</div> <b>M</b>
                        </section>
                      </h1>
                    </div>
                    <div className={styles.stakeBottom}>
                      <div className={styles.stakeBottom1}>
                        <section>
                          <img src={iconLogo} />
                          <p>30,000 <i>LOOP</i></p><b>per day</b>
                        </section>
                      </div>
                      <div className={styles.stakeBottom1 + " paddLeftRight"}>
                        <label>
                          Next Reward
                          <p>
                            30.677 <span>LOOP</span>
                            <i>1,287.21 LOOP</i>
                            <i>*your estimated rewards over 24hrs</i>
                          </p>
                        </label>
                        <button onClick={() => setIsStakeOpenModal(true)}>
                          <b>+</b> STAKE
                        </button>
                      </div>
                      <div className={styles.stakeBottom1 + " paddLeftRight"}>
                        <label>
                          Your Rewards
                          <p>
                            207.07 <span>LOOP</span>
                            <i>1,287.21 UST</i>
                            <i>next reward: 9m 23s</i>
                          </p>
                        </label>
                        <button onClick={() => setIsUnstakeOpenModal(true)}>
                          <b>-</b> UNSTAKE & CLAIM
                        </button>
                      </div>
                      <div className={styles.stakeBottom1}>
                        <label>
                          My Staked Balance
                          <p>
                            29.091492 <span>UST</span>
                            <i>1,287.21 LOOP</i>
                          </p>
                        </label>
                        <label>
                          Deposited
                          <p>29.091492 <span>LOOP</span>
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={styles.mainSectionLooping}>
                    <div className={styles.headingLooping}>
                      <h1 className={styles.comingsoonLooping}>
                        Stake LOOPR (Coming Soon)
                      </h1>
                    </div>
                    <div className={styles.stakeBottom}>
                      <div className={styles.stakeBottom1}>
                        <section>
                          <img src={iconLogo2} alt={''} />
                        </section>
                      </div>
                      <div
                          className={
                              styles.stakeBottom1 + " paddLeftRight" + " framingSet"
                          }
                      >
                        <div className={styles.framingSetinner}>
                          <img src={framing} alt={''} />
                          <img src={framing} alt={''} />
                        </div>
                      </div>
                      <div
                          className={
                              styles.stakeBottom1 + " paddLeftRight" + " framingSet"
                          }
                      >
                        <div className={styles.framingSetinner}>
                          <img src={framing} alt={''} />
                          <img src={framing} alt={''} />
                        </div>
                      </div>
                      <div className={styles.stakeBottom1 + " framingSet"}>
                        <div className={styles.framingSetinner}>
                          <img src={framing} alt={''} />
                        </div>
                      </div>
                    </div>
                  </div>*/}
                </section>
              </div>
              <Modal isOpen={isHelpOpenModal}
                     title="How Staking Works"
                     onClose={closeModalHelp} >
                <div className={styles.howStakingWorks}>
                  <ul>
                    <li>Rewards start accumulating immediately.</li>
                    <li>Rewards are based on the number of LOOP tokens you stake, and the minimum stake period pool you have entered into.</li>
                    <li>There is a minimum staking period before rewards can be claimed, but you can withdraw at any time.</li>
                    <li>If you stake more LP at any time the min stake timer will be reset.</li>
                    <li>Our staking contracts have been audited internally and by a third party. The official TFL audit is still in progress.</li>
                  </ul></div>
              </Modal>
            </>
        )}
      </Page>
  )
}

export default LoopStake

export function useCalculateStakeAPY(user_staked: string, total_staked: string) {

  const tokensDistributedPerDay = useRecoilValue(getTokensDistributedPerDayQuery)
  const { contents } = useLOOPPrice()

  const a = multiple(div(tokensDistributedPerDay, SMALLEST), contents)
  const b = multiple(a,365)
  const tvl = multiple(total_staked, contents)
  return multiple(div(b, tvl), "100")
}

export const StakePlaceholder = () => {
  return (<div className={styles.mainSectionLooping}>
    <div className={styles.headingLooping}>
      <h1>
        Loading...
      </h1>

      <div className={classnames(styles.paddLeftRight, styles.placeholder_content)}>
        <LoadingPlaceholder size={'sm'} color={'green'} />
      </div>
    </div>
    <div className={styles.stakeBottom}>
      <div className={styles.stakeBottom1}>
        <section>
          <img src={loop_icon} alt={''} />
        </section>
      </div>
      <div
          className={
              styles.stakeBottom1 + " paddLeftRight" + " framingSet"
          }
      >
        <div className={styles.framingSetinner}>
          <LoadingPlaceholder />
          <LoadingPlaceholder size={'lg'} color={'pink'} />
        </div>
      </div>
      <div
          className={
              styles.stakeBottom1 + " paddLeftRight" + " framingSet"
          }
      >
        <div className={styles.framingSetinner}>
          <LoadingPlaceholder  />
          <LoadingPlaceholder size={'lg'} color={'pink'} />
        </div>
      </div>
      <div className={styles.stakeBottom1 + " framingSet"}>
        <div className={styles.framingSetinner}>
          <LoadingPlaceholder />
        </div>
      </div>
    </div>
  </div>)
}

export const CardPlaceholder = () => {
  return (<Summary
      labelClassName={styles.label}
      icon={iconLogo2}
      title={
        <TooltipIcon
            className={styles.tooltipNew}
            content="Current LOOP Price"
        >
          ---
        </TooltipIcon>
      }
  >
    <span className={styles.count}>0</span>
    <span className={styles.price}>UST</span>
  </Summary>)
}
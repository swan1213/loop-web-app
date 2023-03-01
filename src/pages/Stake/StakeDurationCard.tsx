import {useState} from "react"
import {TxResult} from "@terra-money/wallet-provider"
import classNames from "classnames"

import {div, gt, lte, multiple, number, plus} from "../../libs/math"
import styles from "../LoopStake.module.scss";
import iconLogo from "../../images/coins/loop_icon.svg";
import {commas, decimal, numbers} from "../../libs/parse"
import {LOOP, UST} from "../../constants"
import {StakeDuration, Type} from "../LoopStake"
import Modal from "../../components/Modal"
import {useContractsAddress} from "../../hooks"
import useHash from "../../libs/useHash"
import {PostError} from "../../forms/FormContainer"
import LoopStakeMinFarm from "../../forms/Staking/LoopStakeMIniForm"
import FormFeedback from "../../components/FormFeedback"
import Tooltip from "../../components/Tooltip"
import useStakeList from "./useStakeList"
import {useProtocol} from "../../data/contract/protocol";

interface Props{
  loopPrice: string
  duration: StakeDuration
  farmResponseFun: (
      res: TxResult | undefined,
      err?: PostError | undefined
  ) => void
}


const StakeDurationCard = ({duration, loopPrice, farmResponseFun}: Props) => {

  const { getToken } = useProtocol()
  const token = getToken(LOOP)
  const { hash: type } = useHash<Type>(Type.STAKE)
  const tab = { tabs: [Type.STAKE], current: type }
  const tabLabels = {
    [Type.STAKE]: "Stake LOOP - 12 Months",
    [Type.UNSTAKE]: Type.UNSTAKE,
  }

  const [isStakeOpenModal, setIsStakeOpenModal] = useState(false)
  const [isUnstakeOpenModal, setIsUnstakeOpenModal] = useState(false)
  const closeModalStake = () => setIsStakeOpenModal(!isStakeOpenModal)
  const closeModalUnstake = () => setIsUnstakeOpenModal(!isUnstakeOpenModal)

  const title = {
    [StakeDuration["12MON"]]:"Stake LOOP - 12 Month",
    [StakeDuration["18MON"]]:"Stake LOOP - 18 Month",
    [StakeDuration["3MON"]]:"Stake LOOP - 3 Month",
  }[duration]

  const monthInNumber = duration === StakeDuration['12MON'] ? 12 : duration === StakeDuration['18MON'] ? 18 : 3

  const stakeModalDescription = {
      new: `Min ${monthInNumber} month stake period before you’re able to claim rewards. You can still withdraw after 24hrs, before the ${monthInNumber} month stake period is over without rewards.`,
      old: [
        `The ${monthInNumber} month min stake period before you’re able to claim rewards will start again from now. Your previous rewards will remain in your position.`,
        `You can stake in other time frames without affecting this min stake period. Withdrawing before the ${monthInNumber} month stake period is over will forefeit rewards.`
      ]
    }

  const unstakeModalDescription = {
    before: [
      `Your min ${monthInNumber} month staking period is not over. Unstake without rewards?`,
      ` Partial withdrawals will be supported in the future.`
    ],
    after: [
      `Your min ${monthInNumber} month staking period is over. Unstake everything with rewards?`,
      `Partial withdrawals will be supported in the future.`
    ]
  }

  const { tvl, apr, tokensDistributedPerDay, nextReward, yourReward, deposited, unStakeTimeLeft } = useStakeList({duration})
  const { shortFormatTime, timeLeft, shortTimeString, shortMonthsString, shortDayString } = unStakeTimeLeft

  return (
      <div className={styles.mainSectionLooping}>
        <div className={styles.headingLooping}>
          <h1>{title}
            {/* <span onClick={() => setIsHelpOpenModal(true)}><img src={terms}/></span> */}
          </h1>

          <h1 className={styles.paddLeftRight}>
              <b>{commas(apr)}%</b>{" "}
            <p>
              {" "}
              APR{" "}
            </p>
            <b className={styles.tvl}>{tvl} {LOOP}</b>{" "}
            <p>
              {" "}
              TVL{" "}
            </p>
          </h1>
        </div>
        <div className={styles.stakeBottom}>
          <div className={classNames(styles.stakeBottom1, styles.stakeBottom11)}>
            <section>
              <img className={styles.img} src={iconLogo} alt={''} />
              <p>{numbers(tokensDistributedPerDay)} <i>LOOP</i></p><b>per day</b>
            </section>
            <h1 className={styles.paddLeftRightDesktop}>
              <div>
                <p>
                  {" "}
                  APR{" "}
                </p>
                <b>{commas(apr)}%</b>{" "}

              </div>
              <div>
                <p>
                  {" "}
                  TVL{" "}
                </p>
                <b className={classNames(styles.tvl, styles.tvl_mob)}>{tvl} {LOOP}</b>{" "}
              </div>
            </h1>
          </div>

          <div className={styles.stakeBottom1 + " paddLeftRight"}>
            <label>
              Next Reward
              <p>
                { nextReward }
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
                {numbers(yourReward.loop)}<span> LOOP</span>
                <i>{numbers(yourReward.ust)} {UST}</i>
                <i>next reward: {yourReward.nextReward}</i>
              </p>
            </label>
              <button className={styles.unstake_stake_btn} disabled={ (lte(deposited ?? "0", 0) || lte(yourReward.loop ?? "0", "0"))} onClick={() => setIsUnstakeOpenModal(true)}>
                <Tooltip content={(gt(deposited ?? "0", "0") && lte(yourReward.loop ?? "0", "0")) ? "Unstake will be enabled after 24Hrs" : ''}>
                <b>-</b> UNSTAKE & CLAIM
                </Tooltip>
              </button>

            {/*<button disabled={true} onClick={() => {}} className={styles.button}>
              <b>-</b> UNSTAKE & CLAIM
            </button>*/}
          </div>
          <div className={styles.stakeBottom1}>
            <label>
              My Total Balance
              <p>{numbers(decimal(plus(deposited,yourReward.loop),3))}<span> {LOOP}</span>
                <i>{commas(decimal(multiple(plus(deposited, yourReward.loop), loopPrice), 2))} {UST}</i>
              </p>
            </label>

            <label>
              {unStakeTimeLeft.time}
            </label>
            {/*<label>
              Deposited
              <p>{div(deposited, SMALLEST)} <span>LOOP</span>
              </p>
            </label>*/}
          </div>
        </div>
        <Modal isOpen={isStakeOpenModal}
               title={title}
               onClose={closeModalStake} >
          <div className={styles.stakeModal}>
            <div className={styles.stakeModalContent}>
              {
                (deposited && gt(deposited ?? "0", "0")) ? stakeModalDescription.old.map((item)=><h2 className={styles.msg}>{item}</h2>) : <h2 className={styles.msg}>{stakeModalDescription.new}</h2>
              }
              <LoopStakeMinFarm
                  type={Type.STAKE}
                  token={token}
                  tab={tab}
                  tabLabels={tabLabels}
                  farmResponseFun={farmResponseFun}
                  key={type}
                  className={styles.form_container}
                  duration={duration}
                  gov
              />
              {/* <p>
              Min 2 week min stake period before you’re able to claim rewards.
              You can still withdraw before the 2 week stake period is over
              without rewards.
            </p>
            <section>
              <div className={styles.stakeModalInner}>
                Balance: <b>121.11</b> LOOP{" "}
                <label>
                  <button>MAX</button>
                </label>
              </div>
              <div className={styles.stakeModalForm}>
                <div className={styles.stakeModalLeft}>
                  <input type="text" value="0.0767" />
                  <i>~0.000 UST</i>
                </div>
                <div className={styles.stakeModalRight}>
                  <button>STAKE</button>
                </div>
              </div>
            </section>*/}
            </div>
          </div>

        </Modal>
        <Modal isOpen={isUnstakeOpenModal}
               title="UnStake LOOP"
               onClose={closeModalUnstake}
               titleClass={styles.modalTitle}
        >

          <div className={styles.stakeModal}>
            <div className={styles.stakeModalContent}>
              {
                gt(number(timeLeft ?? "0"), "0") && shortTimeString.length > 0 ?<h2 className={styles.msg}>{ unstakeModalDescription.before.map((item)=><h2 className={styles.msg}>{item}</h2>)}</h2> : unstakeModalDescription.after.map((item)=><h2 className={styles.msg}>{item}</h2>)
              }
            {gt(number(timeLeft ?? "0"), "0") && shortTimeString.length > 0 && (<div className={styles.stakeModalMiddle}>
              <b>Time left:</b>
              <div>
                <>
                  <b className={styles.pinkColor}>{shortMonthsString}</b><i>{shortMonthsString && "M"}</i><b className={styles.pinkColor}>{shortDayString}</b><i>{shortDayString && "D"}</i><b className={styles.pinkColor}>{shortFormatTime}</b><i>m</i>
                </>
              </div>
            </div>
            )}
            {!gt(number(timeLeft ?? "0"), "0") && (
                <FormFeedback notice help={false}>
                  Are you sure you want to unstake your LOOP and rewards?
                </FormFeedback>
            )}

            <LoopStakeMinFarm
                type={Type.UNSTAKE}
                token={token}
                tab={tab}
                tabLabels={tabLabels}
                farmResponseFun={farmResponseFun}
                key={type}
                className={styles.form_container}
                timeLeft={timeLeft}
                duration={duration}
                gov
            />
            {/*<section>
              <div className={styles.stakeModalInner}>
                Balance: <b className={styles.stakeMarginLeft}>00.15</b> UST{" "}
              </div>
              <div className={styles.stakeModalForm}>
                <div className={styles.stakeModalLeft}>
                  <input type="text" value="0.0767" />
                  <i>~0.000 UST</i>
                </div>
                <div className={styles.stakeModalRight}>
                  <button>UNSTAKE</button>
                </div>
              </div>
            </section>*/}
          </div>
          </div>
        </Modal>
      </div>
  )
}

export default StakeDurationCard
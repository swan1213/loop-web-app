import { ReactNode } from "react"
import classNames from "classnames/bind"
import styles from "./CollapsibleRow.module.scss"
import { Type } from "../pages/Stake"
import { TxResult } from "@terra-money/wallet-provider"
import { PostError } from "../forms/FormContainer"
import LinkButton from "./LinkButton"
import { getPath, MenuKey } from "../routes"
import Button from "./Button"
import Tooltip from "./Tooltip";
import { useFarmPage, FarmType } from "../pages/FarmBeta";
import {FarmContractTYpe} from "../data/farming/FarmV2";

interface Props {
  record: Record
  token: string
    FarmContractType: FarmContractTYpe
  lpToken: string
  subtrClassName?: string
  tdClassName?: string
  index?: number
  children?: ReactNode
  trWithNoBorderClassName?: string
  trWithBorderClassName?: string
  btnClassName?: string
  unstakeBtnClassName?: string
  harvestBtnClassName?: string
  stake_btnClassName?: string
  fullyvested?: string
  unvested?: string
  /** Exclude tax from the contract */
  deduct?: boolean
  /** uusd amount for tax calculation */
  pretax?: string
  hidden?: boolean
  farmResponseFun?: (res: TxResult | undefined, error: PostError | undefined , type?: string) => void
  openModal: (
    record: Record,
    type: Type,
    token: string,
    lpToken: string,
    FarmContractType: FarmContractTYpe
  ) => Record
}

interface Record {
  symbol?: string
  token?: string
}

const CollapsibleRow = ({
  record,
  token,
  lpToken,
  tdClassName,
  index,
  children,
  trWithBorderClassName,
  openModal,
                            FarmContractType,
  hidden,
}: Props) => {

  const openMyModal = (type: Type): any => {
    openModal(record, type, token, lpToken, FarmContractType)
  }
  const farmPage = useFarmPage()

  const currentUrl=window.location.href;

  return (
    <>
      <tr
        key={index}
        className={
          classNames(trWithBorderClassName)
        }
      >
        {children}
        <td className={classNames(tdClassName)}>
          {currentUrl.includes("admin") ? '' :  <LinkButton className={styles.poolBtn} to={getPath(MenuKey.POOL)} >Pool</LinkButton> }
          {currentUrl.includes("admin") ? '' :
            farmPage === FarmType.farm2 ? (
                    <Button disabled={hidden} className={styles.stakeBtn}
                            onClick={() => hidden ? {} : openMyModal(Type.STAKE)}>{hidden ?
                        <Tooltip content={"only for beta users"}>Stake</Tooltip> : 'FARM'}</Button>
                ) : (<Button disabled={hidden} className={styles.stakeBtn}
              onClick={() => hidden ? {} : openMyModal(Type.STAKE)}>{hidden ?
              <Tooltip content={"only for beta users"}>Stake</Tooltip> : 'FARM'}</Button>)

          }
        </td>
      </tr>
    </>
  )
}


const CollapsibleCell = ({
                          record,
                          token,
                          lpToken,
                          tdClassName,
                          index,
                          children,
                          trWithBorderClassName,
                          openModal,
                          hidden,
                             FarmContractType
                        }: Props) => {

  const openMyModal = (type: Type): any => {
    openModal(record, type, token, lpToken, FarmContractType)
  }
  const farmPage = useFarmPage()

  return (
      <>
        <div
            key={index}
            className={
              classNames(trWithBorderClassName)
            }
        >
          {children}
          <td className={classNames(tdClassName)}>
            <LinkButton className={styles.poolBtn} to={getPath(MenuKey.POOL)} >Pool</LinkButton>
            {
              farmPage === FarmType.farm2 ? (
                      <Button disabled={hidden} className={styles.stakeBtn}
                              onClick={() => hidden ? {} : openMyModal(Type.STAKE)}>{hidden ?
                          <Tooltip content={"only for beta users"}>Stake</Tooltip> : 'Stake'}</Button>
                  ) :

                  <Button disabled={true} className={styles.stakeBtn}
                          onClick={() => {}}>{
                    <Tooltip content={"Please stake in Live Farm"}>Stake</Tooltip>}</Button>
            }
          </td>
        </div>
      </>
  )
}
export {
  CollapsibleCell,
  CollapsibleRow
}
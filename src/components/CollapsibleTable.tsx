import {ReactNode, useState} from "react"
import classNames from "classnames/bind"
import {path} from "ramda"
import styles from "./CollapsibleTable.module.scss"
import {CollapsibleRow} from "./CollapsibleRow"
import Modal from "./Modal"
import {Type} from "../pages/Stake"
import FarmStakeForm from "../forms/Farm/FarmStakeForm"
import {TxResult} from "@terra-money/wallet-provider"
import {PostError} from "../forms/FormContainer"
import {bound} from "./Boundary";
import {FarmContractTYpe} from "../data/farming/FarmV2";

const cx = classNames.bind(styles)

interface Props<T> {
  rows?: (record: T) => Row
  columns: Column<T>[]
  dataSource: T[]
  farmResponseFun: (res: TxResult | undefined, errors: PostError | undefined, type?: string) => void
  hidden?: boolean
}

interface Row {
  background?: string
}

interface Column<T> {
  key: string
  title?: ReactNode
  dataIndex?: string
  render?: (value: any, record: T, index: number) => ReactNode
  children?: Column<T>[]
  hideTitle?: boolean

  colSpan?: number
  className?: string
  align?: "left" | "right" | "center"
  fixed?: "left" | "right"
  narrow?: string[]
  border?: BorderPosition[]
  bold?: boolean
  width?: string | number
}

enum BorderPosition {
  LEFT = "left",
  RIGHT = "right",
}

const SEP = "."

type DefaultRecordType = Record<string, any>
function CollapsibleTable<T extends DefaultRecordType>(props: Props<T>) {
  const { columns, dataSource, farmResponseFun, hidden = true } = props

  const normalized = columns.reduce<Column<T>[]>(
    (acc, { children, ...column }) => {
      // Normalize nested columns below `children`
      // The first child draws the left border
      // The last child draws the right border.
      const renderChild = (child: Column<T>, index: number) => ({
        ...child,
        key: [column.key, child.key].join(SEP),
        border: !index
          ? [BorderPosition.LEFT]
          : index === children!.length - 1
          ? [BorderPosition.RIGHT]
          : undefined,
      })

      return !children
        ? [...acc, column]
        : [...acc, ...children.map(renderChild)]
    },
    []
  )

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalType, setModalType] = useState(Type.STAKE)
  const [tokenForm, setTokenForm] = useState("")
  const [lpToken, setLptoken] = useState("")
  const [farmType, setFarmType] = useState<FarmContractTYpe>(FarmContractTYpe.Farm2)

  const openModal = (
    record: any,
    type: Type,
    token: string,
    lpToken: string,
    FarmType: FarmContractTYpe
  ): any => {
    setIsOpenModal(!isOpenModal)
    setModalTitle(type === Type.STAKE ? "Stake LP" : "Unstake LP")
    setModalType(type)
    setLptoken(lpToken)
    setTokenForm(token)
    setFarmType(FarmType)
  }

  const closeModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  const type = Type.STAKE

  const getClassName = ({ align, fixed, narrow, border }: Column<T>) => {
    const alignClassName = `text-${align}`
    const fixedClassName = `fixed-${fixed}`
    const borderClassName = cx(border?.map((position) => `border-${position}`))
    const narrowClassName = cx(narrow?.map((position) => `narrow-${position}`))

    return cx(
      styles.cell,
      alignClassName,
      fixedClassName,
      borderClassName,
      narrowClassName
    )
  }

  const renderColSpan = (column: Column<T>) => {
    // children: colspan attribute, border props
    // No children: empty the title
    const { children } = column

    const colSpan = children?.length
    const next = Object.assign(
      { ...column, colSpan, children: undefined },
      children
        ? { border: [BorderPosition.LEFT, BorderPosition.RIGHT] }
        : { title: "" }
    )

    return renderTh(next)
  }

  const renderTh = (column: Column<T>): ReactNode => {
    const { key, title, colSpan, width } = column
    return (
      <th
        className={classNames(getClassName(column), styles.th)}
        colSpan={colSpan}
        style={{ width }}
        key={key}
      >
        {title ?? key}
      </th>
    )
  }
  // const { isMobile } = useScreen()
  const colspan = columns.some(({ children }) => children)
  return  (
    <div className={styles.wrapper}>
      <table className={classNames(cx({margin: colspan}))}>
        <thead>
        { colspan && (
            <tr className={cx({colspan})}>{columns.map(renderColSpan)}</tr>
        )}

        <tr>{normalized.map(renderTh)}</tr>
        </thead>
        <tbody>
        { dataSource.length ? dataSource.map((record, index) => {
          const renderTd = (column: Column<T>): ReactNode => {
            const {key, dataIndex, render} = column
            const {width} = column
            const value = path<any>((dataIndex ?? key).split(SEP), record)

            return (
                <td style={{width}} key={key}>
                  {render?.(value, record, index) ?? value}
                </td>
            )
          }

          const tdClassName = cx(styles.subtd)
          const trWithBorderClassName = cx(styles.tr_with_border)
          const collapsibleRowProps = {
            record,
            token: record.token,
            lpToken: record.lpToken,
            index,
            tdClassName,
            trWithBorderClassName,
            FarmContractType: record.FarmContractType,
            openModal,
          }

          return (
              bound(<CollapsibleRow
                  {...collapsibleRowProps}
                  key={index}
                  hidden={hidden}
              >
                {normalized.map(renderTd)}
              </CollapsibleRow>, "loading...")
          )
        }) : null
        }
        </tbody>
      </table>
      {/*{ isMobile && <div>
        {dataSource.map((record, index) => {
          const renderCell = (column: Column<T>): ReactNode => {
            const {key, dataIndex, render} = column
            const value = path<any>((dataIndex ?? key).split(SEP), record)

            return (
                <div className={styles.singleCell} key={key}>
                  {render?.(value, record, index) ?? value}
                </div>
            )
          }

          const tdClassName = cx(styles.subtd)
          const trWithBorderClassName = cx(styles.tr_with_border)
          const collapsibleRowProps = {
            record,
            token: record.token,
            lpToken: record.lpToken,
            index,
            tdClassName,
            trWithBorderClassName,
            openModal,
          }
          return (
              bound(<CollapsibleCell
                  {...collapsibleRowProps}
                  key={index}
                  hidden={hidden}
              >
                {normalized.filter(({ key }) => key !== 'rank').map(renderCell)}
              </CollapsibleCell>, "loading...")
          )
        })}
      </div>}*/}
      <Modal isOpen={isOpenModal} title={modalTitle} onClose={closeModal}>
        {type && (
          <FarmStakeForm
            type={type}
            token={tokenForm}
            lpToken={lpToken}
            farmResponseFun={farmResponseFun}
            partial
            key={type}
           farmContractType={farmType}/>
        )}
      </Modal>
    </div>
  )
}

export default CollapsibleTable

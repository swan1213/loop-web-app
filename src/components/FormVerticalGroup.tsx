import { useRef } from "react"
import classNames from "classnames"
import Button from "./Button"
import styles from "./FormVerticalGroup.module.scss"
import classnames from "classnames"
import {div, multiple} from "../libs/math";
import {decimal} from "../libs/parse";

const cx = classNames.bind(styles)

const FormGroup = ({
  input,
  textarea,
  select,
  value,
  unitClass,
  miniForm,
                     multiLines,
  ...props
}: FormGroup) => {
  const {
    label,
    help,
    unit,
    max,
    maxValue,
    assets,
    focused,
    error,
    smScreen,
    type = 1,
    hideInput= false,
    maxOnly= false
  } = props
  const pageName = window.location.pathname
  const hashName = window.location.hash
  const { skipFeedback } = props
  const inputRef = useRef<HTMLInputElement>()
  const handleWheel = () => {
    inputRef.current?.blur()
  }

  const border = cx(styles.border, { focused, error, readOnly: value })
  const maxProps = {
    type: "button",
    className: classnames(styles.max, maxOnly ?  styles.maxOnly : ''),
    onClick: max,
    size: "xs",
    children: "MAX",
  }

  const addedAmountPercent = (val) => {
    inputRef.current?.focus()
    let inputValue = decimal(multiple(maxValue?.(), val), unit.props?.token === 'uusd' ? 3 : (input?.decimal ? input.decimal : 4))
    if(inputValue) {
      input?.setValue && input?.setValue(input.name, inputValue)
    }
  }

  return (
      <div
      className={classNames(
        styles.group,
        styles.component,
        styles.slippageComponent,
        label == "To" ? styles.toSwap : ""
      )}
    >
        { multiLines && label && (
            <header className={classNames(styles.header, multiLines ? styles.slippageHeaderMulti : styles.slippageHeader)}>
              <section className={classnames(styles.label, multiLines ? styles.labelMulti : '')}>
                <label htmlFor={input?.id}>{label}</label>
              </section>
            </header>
        )}
        {unit && (
            <section
                className={classNames(
                    styles.unit,
                    styles.slippagefromUnit,
                    unitClass,
                )}
            >
              {unit}
            </section>
        )}
        {max ? (
            <div className={classnames(styles.slippageMax, maxOnly ? styles.slippageMaxMargin : '')}>
              {!maxOnly && (<><span
                  onClick={() => {
                    addedAmountPercent("0.25")
                  }}
              >
            25%
          </span>
                <span
                    onClick={() => {
                      addedAmountPercent("0.50")
                    }}
                >
            50%
            </span>
                <span
                    onClick={() => {
                      addedAmountPercent("0.75")
                    }}
                >
            75%
            </span>
              </>)}
              {/*<span
            onClick={() => {
              addedAmountPercent("1")
            }}
          >
            MAX
          </span>*/}
              <Button {...maxProps} />
            </div>
        ) : (
            ""
        )}
      <div className={cx(type === 1 && border)}>
        <section
          className={classNames(cx(type === 2 && border) , styles.slippagefrom, miniForm ? styles.slippagefrom_mini  : '')}
        >
          <section
            className={
              classNames(pageName == "/farm" || hashName == "#withdraw"
                  ? styles.wrapper + " " + styles.wrapper2
                  : styles.wrapper,
                  miniForm ? styles.wrapper_mini  : '')
            }
          >
            <section
              className={classNames(
                styles.field)}
            >
              {help && !hideInput && (
                <b className={classNames(styles.pendiongSlippage)}>{help.content}</b>
              )}

              {input ? (hideInput ? '' : (
                <input
                  {...input}
                  onWheel={handleWheel}
                  id={label}
                  ref={inputRef}
                  className={classnames( multiLines ? styles.slippageFormMultiInput : '')}
                />
              )) : textarea ? (
                <textarea {...textarea} />
              ) : select ? (
                <div className={styles.select}>{select}</div>
              ) : (
                <input value={value} disabled />
              )}
            </section>
          </section>
          {assets && <section className={styles.assets}>{assets}</section>}
        </section>
      </div>

      {error && !skipFeedback && (
        <p
          className={
            hashName == "#provide" || hashName == "#withdraw"
              ? styles.poolBox + " " + styles.feedback
              : styles.swapBox + " " + styles.feedback
          }
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default FormGroup

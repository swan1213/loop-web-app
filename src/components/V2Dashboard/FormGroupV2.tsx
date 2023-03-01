import { useRef } from "react"
import classNames from "classnames"
import Button from "../../components/Button"
import styles from "./FormGroupV2.module.scss"
import { multiple } from "../../libs/math"
import { commas, decimal } from "../../libs/parse"

const cx = classNames.bind(styles)

const FormGroupV2 = ({
  input,
  textarea,
  select,
  value,
  unitClass,
  miniForm,
  showBalance,
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
    className: styles.max,
    onClick: max,
    size: "xs",
    children: "MAX",
  }
  const addedAmountPercent = (val) => {
    inputRef.current?.focus()
    let inputValue = decimal(
      multiple(maxValue?.(), val),
      input.decimal ? input.decimal : 4
    )
    if (inputValue) {
      input.setValue(input.name, inputValue)
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
      <div className={cx(type === 1 && border)}>
        {/* {label && (
          <header className={classNames(styles.header, styles.slippageHeader)}>
            <section className={styles.label}>
              <label htmlFor={input?.id}>{label}</label>
            </section> */}

            {/*{help && (
              <section className={styles.help}>
                {help.title}: <strong>{help.content}</strong>
              </section>
            )}*/}
            {/*{max && <Button {...maxProps} />}*/}
          {/* </header> */}
        {/* )} */}

        <section
          className={classNames(
            cx(type === 2 && border),
            styles.slippagefrom,
            miniForm ? styles.slippagefrom_mini : ""
          )}
        >
          <section
            className={classNames(
              pageName == "/farm" || hashName == "#withdraw"
                ? styles.wrapper + " " + styles.wrapper2
                : styles.wrapper,
              miniForm ? styles.wrapper_mini : ""
            )}
          >
            {" "}
            <div className={styles.fromToken}>
              {" "}
              {label !== "To" && (
                <div className={styles.slippagePax}>
                  {input.setValue ? (
                    <span className={styles.maxContainer}>
                      <span
                        onClick={() => {
                          addedAmountPercent("0.25")
                        }}
                        className={styles.slippagePax_span}
                      >
                        25%
                      </span>
                      <span
                        onClick={() => {
                          addedAmountPercent("0.50")
                        }}
                        className={styles.slippagePax_span}
                      >
                        50%
                      </span>
                      <span
                        onClick={() => {
                          addedAmountPercent("0.75")
                        }}
                        className={styles.slippagePax_span}
                      >
                        75%
                      </span>
                      {/*<span
            onClick={() => {
              addedAmountPercent("1")
            }}
          >
            MAX
          </span>*/}
                      <span>
                        <Button {...maxProps} />
                      </span>
                    </span>
                  ) : null}
                  <span className={styles.MyBalance}>
                    <span
                      style={{
                        marginTop: "1px",
                        color: "#919191",
                        fontSize: "12px",
                      }}
                    >
                      Balance:
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        marginTop: "1px",
                        paddingLeft: "2px",
                      }}
                    >
                      {help && (
                        <b style={{ color: "#919191" }}>{help.content}</b>
                      )}
                    </span>
                  </span>
                </div>
              )}
              {unit && (
                // <div className={styles.toToken}>
                <>
                  {showBalance && (
                    <>
                      <span className={styles.MyBalance}>
                        <span>Balance: </span>
                        {help && (
                          <b className={styles.UserBalance}>{help.content}</b>
                        )}
                      </span>
                      <section
                        className={classNames(
                          styles.unit,
                          styles.slippagefromUnit,
                          unitClass,
                          miniForm ? styles.slippagefromUnitMini : ""
                        )}
                      >
                        {unit}
                      </section>
                    </>
                  )}
                  {!showBalance && (
                    <section
                      className={classNames(
                        styles.unit,
                        styles.slippagefromUnit,
                        unitClass,
                        miniForm ? styles.slippagefromUnitMini : ""
                      )}
                    >
                      {unit}
                    </section>
                  )}
                </>
              )}
            </div>
            <section
              className={classNames(
                styles.field + " " + styles.slippagefromFields,
                smScreen ? styles.sm_field : "",
                miniForm ? styles.miniField : ""
              )}
            >
              {input ? (
                <input
                  {...input}
                  onWheel={handleWheel}
                  id={label}
                  ref={inputRef}
                />
              ) : textarea ? (
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

export default FormGroupV2

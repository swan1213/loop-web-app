import {FC, ReactNode, useEffect} from "react"

import classNames from "classnames/bind"
import Card from "./Card"
import Icon from "./Icon"
import Loading, {SandLoading} from "./Loading"
import Button from "./Button"
import LinkButton, { LinkProps } from "./LinkButton"
import styles from "./Wait.module.scss"
import Grid from "./Grid";
import {gt} from "../libs/math";
import ExtLinkButton from "./ExtLinkButton";
import useStep from "../hooks/Farm/useStep";
import {useHistory} from "react-router-dom";

const cx = classNames.bind(styles)

export enum STATUS {
  SUCCESS = "success",
  LOADING = "loading",
  FAILURE = "failure",
}

interface Props {
  status: STATUS
  hash?: ReactNode
  link?: LinkProps
  button?: ButtonProps
  resetIt?: ButtonProps
}

const Wait: FC<Props> = ({ status, hash, link, button, children, resetIt }) => {
  const pageName = window.location.pathname

  const title = {
    [STATUS.SUCCESS]: "Done!",
    [STATUS.LOADING]: pageName === '/farm-wizard' ? "Submitting request" : "Wait for receipt...",
    [STATUS.FAILURE]: "Failed",
  }[status]

  const iconName = {
    [STATUS.SUCCESS]: "check_circle_outline",
    [STATUS.LOADING]: null,
    [STATUS.FAILURE]: "highlight_off",
  }[status]

  const icon = iconName ? (
    <Icon name={iconName} className={cx(status,  pageName === '/farm-wizard' ? styles.loadingv2 : '')} size={50} />
  ) : (
      <Loading className={pageName === '/farm-wizard' ? styles.loadingv2 : ''} size={40} />
  )

  const errorsCast = (msg: any) => {
    try {
      /*if(msg.match("unauthorized permission requested")){
        return "Slippage tolerance is insufficient to complete swap during current trading conditions. Please increase slippage and try again."
      }*/
      if(msg.toLowerCase().match("max spread assertion")){
        return "Slippage tolerance is insufficient to complete swap during current trading conditions. Please increase slippage and try again."
      }
      return msg
    }catch (err){
      return msg
    }
  }

  const { step, searchQ, searchObj} = useStep(status)
  const history = useHistory()

  const redirect = () => {
    const params  = Object.keys(searchObj).map((index) => `${index}=${searchObj[index]}`).join('&')
    history.push({search: params})
  }

  useEffect(()=>{
    if(pageName === '/farm-wizard' && status === STATUS.SUCCESS){
      redirect()
    }
  },[status])

  return (
    <Card icon={icon} title={title} lg headerClass={pageName === '/farm-wizard'  ? styles.headerV2 : ''} className={pageName === '/farm-wizard'  ? styles.cardHeaderV2 : ''}>
      <section className={styles.contents}>
        {hash && <div className={styles.hash}>{hash}</div>}

        {status === STATUS.FAILURE ? (
          <p className={styles.feedback}>{errorsCast(children)}</p>
        ) : (
            <p className={styles.feedback}>{children} </p>
        )}
      </section>

      {(link || button || resetIt) && (
        <footer>
          <Grid>
            {
              resetIt && ( pageName === '/farm-wizard'  ? ( gt(step,'3') ? '' : <ExtLinkButton className={styles.continueBtn} href={step == '4' ? '/my' :  `/farm-wizard?${searchQ}`} target={'_self'} size="lg" >Next Step</ExtLinkButton>) : (resetIt && <Button {...resetIt} size="lg" submit />))
            }
          { link ? (
            <LinkButton {...link} size="lg" submit />
          ) : (
            <Button {...button} size="lg" submit />
          )}
          </Grid>
        </footer>
      )}
    </Card>
  )
}

export default Wait

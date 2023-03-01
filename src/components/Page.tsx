import {FC, ReactNode, useState} from "react"
import { DOCS } from "../constants"
import Container from "./Container"
import ExtLink from "./ExtLink"
import Icon from "./Icon"
import styles from "./Page.module.scss"
import classNames from "classnames";
import Boundary from "./Boundary";
import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";

interface Props {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  select?: ReactNode
  doc?: string
  sm?: boolean
  noBreak?: boolean
  className?: string
  lazy?: boolean
}

const Page: FC<Props> = ({className, title, description, children, ...props }) => {
  const { doc, action, select, sm, noBreak, lazy = true } = props

  let [color] = useState("#FFFFFF")
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: white;
  `

  return (
    <article className={classNames(styles.article,styles.pageSettings, className)}>
      {title && (
        <header className={styles.header}>
          <section className={styles.heading}>
            <h1 className={styles.title}>{title}</h1>

            {select && (
              <div className={styles.select}>
                {select}
                <Icon name="arrow_drop_down" size={18} />
              </div>
            )}

            {doc && (
              <ExtLink href={DOCS + doc} className={styles.doc}>
                <Icon name="article" size={12} className={styles.icon} />
                Docs
              </ExtLink>
            )}
          </section>
          {action && <section className={styles.action}>{action}</section>}
        </header>
      )}

      {description && (
        <section className={styles.description}>{description}</section>
      )}

      {!!title && !noBreak && <hr />}

      <Boundary
          fallback={
              lazy && <div className="dashboardLoader">
              <ClipLoader
                  color={color}
                  loading={true}
                  css={override}
                  size={50}
              />
            </div>
          }
      >
        {sm ? <Container sm>{children}</Container> : children}
        {/*<Notifications />*/}
      </Boundary>
    </article>
  )
}

export default Page

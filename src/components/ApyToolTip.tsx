import { FC } from "react"
import Tippy, { TippyProps } from "@tippyjs/react"
import classNames from "classnames"
import { isNil } from "ramda"
import Icon from "./Icon"

import "tippy.js/dist/tippy.css"
import "tippy.js/themes/light-border.css"
import styles from "./ApyTooltip.module.scss"

export const DefaultTippyProps: TippyProps = {
  animation: false,
  interactive: true,
  appendTo: document.body,
}

export const DropdownTippyProps: TippyProps = {
  ...DefaultTippyProps,
  placement: "bottom-end",
  trigger: "click",
}

const TooltipTippyProps: TippyProps = {
  ...DefaultTippyProps,
  placement: "bottom",
  theme: "light-border",
  className: styles.tooltip,
}

interface Props extends Omit<TippyProps, "children"> {
  onClick?: () => void
}

const ApyTooltip: FC<Props> = ({ className, onClick, children, ...props }) => {
  const button = (
    <button
      type="button"
      className={classNames(styles.button, className)}
      onClick={onClick}
    >
      {children}
    </button>
  )

  return props.content ? (
    <Tippy
      {...TooltipTippyProps}
      {...props}
      hideOnClick={isNil(props.visible) ? false : undefined}
    >
      {button}
    </Tippy>
  ) : (
    button
  )
}

export const ApyTooltipIcon: FC<Props> = ({ children, ...props }) => (
  <div className={styles.flex}>
    {children}
    <div className={styles.icon}>
      <ApyTooltip {...props}>
        <Icon name="info_outline" size={16} />
      </ApyTooltip>
    </div>
  </div>
)

export default ApyTooltip;

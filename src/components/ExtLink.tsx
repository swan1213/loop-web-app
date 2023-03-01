import { AnchorHTMLAttributes } from "react"

export type Props = AnchorHTMLAttributes<HTMLAnchorElement>
const ExtLink = ({ children, target='_blank', ...attrs }: Props) => (
  <a {...attrs} target={target} rel="noopener noreferrer">
    {children}
  </a>
)

export default ExtLink

import { FC, ReactNode, Suspense } from "react"
import ErrorBoundary from "./ErrorBoundary"
import TerraDown from "./Static/TerraDown";

const Boundary: FC<{ fallback?: ReactNode }> = ({ children, fallback }) => {
  const renderError = (error?: Error) => (
    <TerraDown />
  )
  return (
    <ErrorBoundary fallback={renderError}>
      <Suspense fallback={fallback ?? null}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default Boundary

/* utils */
export const bound = (children: ReactNode, fallback?: ReactNode) => (
  <Boundary fallback={fallback}>{children}</Boundary>
)

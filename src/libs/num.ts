import { isFinite, times } from "./math"
import { decimal } from "./parse"

export const percent = (value?: string, dp = 2): string =>
  isFinite(value) ? decimal(times(value, 100), dp) + "%" : ""

export const percentage = (
  value?: string,
  multiple: number = 1,
  dp = 2
): string => (isFinite(value) ? decimal(value, dp) + "%" : "")

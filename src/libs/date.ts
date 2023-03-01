import { addMinutes, format } from "date-fns"

export const getUTCDate = () => {
  const offset = new Date().getTimezoneOffset()
  const utc = addMinutes(new Date(), offset)
  return format(utc, "MMM d")
}

export const getHumanTime = (milliseconds: number) => {
  let temp = milliseconds / 1000
  const years = Math.floor(temp / 31536000),
    days = Math.floor((temp %= 31536000) / 86400),
    hours = Math.floor((temp %= 86400) / 3600),
    minutes = Math.floor((temp %= 3600) / 60),
    seconds = temp % 60

  if (days || hours || seconds || minutes) {
    return (
      (years ? years + "y " : "") +
      (days ? days + "d " : "") +
      (hours ? hours + "h " : "") +
      (minutes ? minutes + "m " : "") +
      Number.parseFloat(seconds.toString()).toFixed(2) +
      "s"
    )
  }

  return "< 1s"
}

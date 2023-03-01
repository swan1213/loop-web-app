import {useRecoilValue} from "recoil";
import {useEffect, useState} from "react";
import {div, lte, minus, multiple, number, plus} from "../../libs/math";
import {intervalToDuration} from "date-fns";
import {
  getDistributionWaitTimeQuery,
  getLastDistributionTimeQuery,
} from "../../data/stake/stake";
import {StakeDuration} from "../LoopStake";
import {
  getDistributionWaitTime18MonQuery,
  getDistributionWaitTime3MonQuery,
  getLastDistributionTime18MonQuery, getLastDistributionTime3MonQuery
} from "../../data/stake/stake18Mon";

export default (duration: StakeDuration) => {

  const values:any =  {
    [StakeDuration["12MON"]]:{
      getDistributionWaitTimeQuery: getDistributionWaitTimeQuery,
      getLastDistributionTimeQuery: getLastDistributionTimeQuery
    },
    [StakeDuration["18MON"]]:{
      getDistributionWaitTimeQuery: getDistributionWaitTime18MonQuery,
      getLastDistributionTimeQuery: getLastDistributionTime18MonQuery
    },
    [StakeDuration["3MON"]]:{
      getDistributionWaitTimeQuery: getDistributionWaitTime3MonQuery,
      getLastDistributionTimeQuery: getLastDistributionTime3MonQuery
    }
  }[duration]

  const getDistributionWaitTime = useRecoilValue<string | undefined>(values.getDistributionWaitTimeQuery)
  const getLastDistributionTime = useRecoilValue<string | undefined>(values.getLastDistributionTimeQuery)

  const [timeString, setTimeString] = useState('')
  const [shortTimeString, setShortTimeString] = useState('')
  const [dayString, setDayString] = useState('')
  const [monthsString, setMonthsString] = useState('')
  const [shortDayString, setShortDayString] = useState('')
  const [shortMonthsString, setShortMonthsString] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)

  const [currentTime, setTime] = useState(div(Date.now(), 1000));

  useEffect(() => {
    const interval = setInterval(() => setTime(div(Date.now(), 1000)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const shorts = {
    days: "d",
    hours: "h",
    minutes: "m",
    seconds: "s",
  };

  useEffect(()=>{
    const remaningTime = minus(plus(getDistributionWaitTime, getLastDistributionTime), currentTime ?? "0")
    setTimeLeft(number(remaningTime))
    const time = intervalToDuration({ start: 0, end: number(multiple(remaningTime, "1000")) });
    const timeArray = Object.keys(time).filter((item) => ['hours', 'minutes', 'seconds'].includes(item));
    setTimeString(timeArray.map((item)=> `${lte(time[item], 9) ? `0${time[item]} ${shorts[item]}` : `${time[item]} ${shorts[item] }`}`).join(' '))
    setShortTimeString(timeArray.map((item)=> `${lte(time[item], 9) ? `0${time[item]}` : `${time[item]}`}`).join(':'))
    const days = time['days'];
    days && setDayString(`${lte(days, 9) ? `0${days}` : days} Days `)
    days && setShortDayString(`${lte(days, 9) ? `0${days}` : days} D `)

    const months = time['months'] ?? "";
    days && setMonthsString(`${lte(months, 9) ? `0${months}` : months} Months `)
    days && setShortMonthsString(`${lte(months, 9) ? `0${months}` : months} M `)
  },[getDistributionWaitTime, currentTime, getLastDistributionTime])

  return {
    timeString,
    shortTimeString,
    timeLeft,
    formatTime: `${monthsString ? monthsString : ""} ${dayString ? dayString : ""} ${timeString}`,
    shortFormatTime: `${shortMonthsString ? shortMonthsString : ""}${shortDayString ? shortDayString : ""} ${shortTimeString}`
  }
}

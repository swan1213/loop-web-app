import { useEffect, useState } from "react"
import {plus} from "../../libs/math"

const queryString = require('query-string')

export default (status: any, page?: string | number) => {
  const [searchQ, setSearchQ]  = useState('')
  const [searchObj, setSearchObj]  = useState({})
  const [step, setStep]  = useState('')
  const [nextStep, setNextStep]  = useState('')

  useEffect(()=>{
    const  query= queryString.parse(window.location.search);

    if(query.step){
      const currentStep  = page ? page : query?.step?.replace(/step/g, "").trim()
      setStep(currentStep)
      setNextStep(plus(currentStep, "1"))
      const  q = {...query, step: currentStep == '4' ? 'my' : `step${plus(step,"1")}`}
      // @ts-ignore
      const params  = Object.keys(q).map((index) => `${index}=${q[index]}`).join('&')
      const quer = {...query, step: `step${plus(currentStep, "1")}`}
      setSearchQ(params)
      setSearchObj(quer)
    }
  },[window.location, status])

  return {
    step,
    searchQ,
    searchObj,
    nextStep
  }
}

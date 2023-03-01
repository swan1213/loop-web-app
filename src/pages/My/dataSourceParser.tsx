import { SMALLEST } from "../../constants"
import { num,div } from "../../libs/math"

export const parseDataSource = (dataSource: any,name:string,keyValue:string,symbol:string) => {
    const dataSourceSet = dataSource.sort((a, b) => num(b[keyValue]) - num(a[keyValue]))
    const data1 = dataSourceSet.length >= 8 ? dataSourceSet
      .slice(0, 7)
      .map((item) => num(name==='holdings' ? div(item[keyValue], SMALLEST) : item[keyValue] )) : dataSourceSet?.map((item) => num((name==='holdings' ? div(item[keyValue], SMALLEST) : item[keyValue] )))
    const remainingDataSet =  dataSourceSet.length >= 8 ? dataSource
      .slice(7, dataSourceSet.length)
      .map((item) => num((name==='holdings' ? div(item[keyValue], SMALLEST) : item[keyValue] )))
      .reduce((a, b) => a + b, 0) : []
  
    const symbolsArray = dataSourceSet.length >= 8 ? dataSourceSet.slice(0, 7).map((item) => item[symbol]) : dataSourceSet?.map((item) => item[symbol])

    return {
        symbolsArray,
        data1,
        remainingDataSet,
    }

}
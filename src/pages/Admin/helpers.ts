export const getLpArray = (dataSource:any) => {

    const lpArray :any = []

    dataSource && dataSource.length > 0 && dataSource.map((item, index) => {return lpArray.push(item?.token?.token?.contract_addr)})

    return lpArray;

}
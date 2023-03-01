import {useGetTokenList} from "../../data/form/select";
import {CONTRACT} from "../useTradeAssets";
import {useContractsList} from "../../data/contract/normalize";
import {SelectType} from "../../forms/Exchange/useSelectSwapAsset";
import {useContractsV2List, useGetTokenListV2, usePairsV2List} from "../../data/contract/factoryV2";
import {insertIf} from "../../libs/utils";

export const skipedPairs = [
  'terra1kw95x0l3qw5y7jw3j0h3fy83y56rj68wd8w7rc',
  'terra12aazc56hv7aj2fcvmhuxve0l4pmayhpn794m0p',
  'terra1lgazu0ltsxm3ayellqa2mhnhlvgx3hevkqeqy2',
  'terra1jfp5ew4tsru98wthajsqegtzaxt49ty4z2qws0',
  'terra1whns5nyc8sw328uw3qqnyafxd5yfqsytkdkgqz',
  'terra1jkr0ef9fpghdru38ht70ds6jfldprgttw6xlek',
  'terra1fgc8tmys2kxzyl39k3gtgw9dlxxuhlqux7k38e',
  'terra1l60336rkawujnwk7lgfq5u0s684r99p3y8hx65',
  'terra1a26j00ywq0llvms707hqycwlkl9erwhacr6jve'
]
export const skipPair = [
  'terra154jt8ppucvvakvqa5fyfjdflsu6v83j4ckjfq3'
]

export const skipLp = [
  'terra1p266mp7ahnrnuxnxqxfhf4rejcqe2lmjsy6tuq'
]

/**
 * get asset tokens for select box
 * @param secondToken
 * @param asPairs
 * @param selectType
 * @param newFactory
 */
const useAssetTokens = (secondToken?: string | undefined, asPairs: boolean | undefined = false, selectType?: SelectType, newFactory: boolean = false ): CONTRACT[] => {
  const pageName = window.location.pathname
  const hashName = window.location.hash
  // const contracts = useRecoilValue(contractsList)`
  // const { hash: type } = useHash<Type>(undefined)

  const { contents: contracts } = useContractsList()
  const { contents: contractsV2 } = useContractsV2List()
  // console.log("usePairsV2List", usePairsV2List())
  // const tokenList = useRecoilValue((getTokensList))
  const tokenList = useGetTokenList()
  const tokenListV2 = useGetTokenListV2()
  const enableFactoryV2 =  newFactory || ["/pool-v2", "/swap2"].includes(pageName) && ["#provide","#Swap2", "#withdraw"].includes(hashName)

  if (!secondToken) {
    // add factory v2 contracts
    let filters = []
    if(enableFactoryV2){
      filters = tokenListV2(asPairs ? 'pair' : 'token').filter((contract: CONTRACT) => {
        return selectType ? !skipedPairs.includes(contract.pair) : true
      })
    }

    const items = !newFactory ? tokenList(asPairs ? 'pair' : 'token').filter((contract: CONTRACT) => {
      return selectType ? !skipedPairs.includes(contract.pair) : true
    }).filter((item) => enableFactoryV2 ? !skipPair.includes(item.pair) : true) : []


    return [...items, ...filters]
  } else {
    // add factory v2 contracts
    let filters: CONTRACT[] | undefined = []
    if(enableFactoryV2){
      filters = contractsV2 && contractsV2.filter((contract: CONTRACT) => {
        return (contract.secondToken === secondToken && (selectType ? !skipedPairs.includes(contract.pair) : true))
      })
    }

    const items = !newFactory ? contracts && contracts?.filter((contract: CONTRACT) => {
      return (contract.secondToken === secondToken && (selectType ? !skipedPairs.includes(contract.pair) : true))
    }).filter((item) => enableFactoryV2 ? !skipPair.includes(item.pair) : true) :[]


    return ((items !== undefined && items.length > 0) && (filters !== undefined && filters.length > 0)) ? [...items, ...filters] : (items !== undefined && items.length > 0) ? [...items] : (filters !== undefined && filters.length > 0) ? [...filters]  : []
  }
}

export default useAssetTokens

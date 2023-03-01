import {selector} from "recoil"
import {protocolQuery} from "../contract/protocol"
import {priceKeyIndexState} from "../app"
import {FarmContractTYpe, getDevTokenContractQueryFarm2, useFindlistOfDistributableTokensByPoolFarm2, useStakeableListFarm2} from "./FarmV2"
import { useFarms } from "../contract/normalize"

export const farminglpTokenBalanceQueryFarm2Type = selector({
    key: "farminglpTokenBalanceQueryFarm2Type",
    get: ({ get }) => {
        const { contracts } = get(protocolQuery)
        get(priceKeyIndexState)
        return async (type: FarmContractTYpe) => {
            if (contracts) {
                const getListedContractQueries = get(getDevTokenContractQueryFarm2(type))
                if (getListedContractQueries) {
                    return await getListedContractQueries<Balance>(
                        (lp: string) => ({contract: lp, name: lp, msg: {balance: {address: contracts[type] ?? ""}}}),
                        "farminglpTokenBalanceQueryFarm2Type"
                    )
                }
            }
        }
    },
})

/*const useData = ()=>{
    const farminglpTokenBalanceQueryFarmFn = useRecoilValue(farminglpTokenBalanceQueryFarm2Type)
    const [farminglpTokenBalanceList, setfarminglpTokenBalanceList] = useState<any[]>([])

    useEffect(()=>{
        Promise.all(Object.keys(FarmContractTYpe).map(async (item)=>{
            /!*return new Promise(async (resolve) => {*!/
            const data = await farminglpTokenBalanceQueryFarmFn(FarmContractTYpe[item])
            console.log("datadata", data, FarmContractTYpe[item])
            return { type: FarmContractTYpe[item], data }
            /!*resolve({ type: FarmContractTYpe[item], data })
        })*!/
        })).then((item) =>{
            console.log("item", item)
            setfarminglpTokenBalanceList(item)
        })
    },[])
}*/
/*
export const farminglpTokenBalanceParsedFarm2Type = selector({
    key: "farminglpTokenBalanceParsedFarm2Type",
    get: async ({ get }) => {
        const result = get(farminglpTokenBalanceQueryFarm2Type)
        return async (lp: string, type: FarmContractTYpe) => {
            const res = await result(type)
            const list = res ? dict(res, ({ balance }) => balance) : {}
            return lp ? list?.[lp] : "0"
        }
    },
})
*/


// export const farminglpTokenBalanceFn = selector({
//     key: "farminglpTokenBalanceFn",
//     get: ({get}) => {
//         const items = get(farminglpTokenBalanceQueryFarm2Type)
//         return (lpToken: string, type: FarmContractTYpe) => items && items.length && items[type] ? items[type][lpToken] : undefined
//     }
// })

// export const farmRewards = selectorFamily({
//     key: "farmRewards",
//     get: ({type, lpToken}:{ type: FarmContractTYpe, lpToken: string}) => async ({ get }) => {
//         get(priceKeyIndexState)
//         const { getPair }  = get(protocolQuery)
//         const { check8decOper }  = get(getTokenInfoMethods)
//         const findAllRewards  = get(useFindlistOfDistributableTokensByPoolFarm2(type))
//         const all_rewards = findAllRewards(lpToken)
//         const findDistributedRewards  = get(findDistributedRewardsInPoolFarm2(type))
//         const rewards = await findDistributedRewards(all_rewards ? all_rewards : [], lpToken, "all")
//         const getPairsPriceQuery = get(getPairsPriceQueryState)

//         const findPairPoolPriceFn = (pair: string, token: string) => {
//             const item = getPairsPriceQuery && getPairsPriceQuery.length > 0 ? getPairsPriceQuery.find((item) => item.pair === pair) : undefined;
//             if (item) {
//                 return item.token === token ? item.pool : item.uusdPool
//             }
//             return "0"
//         }

//         const li = rewards &&
//         Object.keys(rewards).map((item) => {
//             const token1UstPair = getPair(item)
//             const token1Price =
//                 isNative(item) && item === "uusd"
//                     ? "1"
//                     : findPairPoolPriceFn(token1UstPair ?? "", item) ?? "0"

//             const reward = check8decOper(item)
//                 ? adjustAmount(true, true, div(rewards[item], SMALLEST))
//                 : div(rewards[item], SMALLEST)
//             return multiple(reward, token1Price)
//         })
//         return li && li.length > 0 ? li.reduce((a, b) => plus(a, b)) : "0"
//     },
// })


// export const UserRewardinFarmUst = selector({
//     key: "UserRewardinFarmUst",
//     get: ({ get }) => {
    
//         get(priceKeyIndexState)
//         return async (type: FarmContractTYpe) => {
//             const contracts = get(listOfStakeableTokensQueryFarm2(type)) // lp
//             contracts.filter();   
//         }
//     },
// })

export const useRewardsInUst = (FarmType: FarmContractTYpe) => {
    const list = useFarms()
    // const listofStakeable = useStakeableListFarm2(FarmType)
    const findListOfDistributableTokensFn =
    useFindlistOfDistributableTokensByPoolFarm2(FarmType)

    // console.log("listofStakeable",listofStakeable)

    const dataSource=list
    // .filter((item) => listofStakeable.includes(item.lpToken))
    .map((item)=>{return((findListOfDistributableTokensFn(item.lpToken)))})

    return dataSource;
}

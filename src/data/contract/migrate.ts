import {atom, atomFamily, selector, selectorFamily} from "recoil"
import {addressState} from "../wallet"
import {getContractQueryQuery} from "../utils/query"
import {protocolQuery} from "./protocol"
import {LISTHarvest} from "../../hooks/Farm/useHarvest"
import {STAKED} from "../../hooks/Farm/useStakedByUser";
import {useStore} from "../utils/loadable";
import {useEffect, useMemo, useState} from "react";
import {minus} from "../../libs/math";
import {getHumanTime} from "../../libs/date"
import {priceKeyIndexState} from "../app";
import {getContractQueriesQuery} from "../utils/queries";
import {GetTokenInfoDocument} from "../../types/contract";
import alias from "./alias";
import {contractsV2Query} from "./factoryV2";
import {FarmContractTYpe} from "../farming/FarmV2";
import {getContractsLpQuery} from "../farming/stakeUnstake";

interface CURRENCY {
    token: { contract_addr: string }
}

interface PendingQueue {
    amount: string
    curr: CURRENCY
    name: string
    time: Number
}

interface ClaimBonusList {
    asset: {
        token: {
            contract_addr: string
        }
    }
    fullyvested: string
    unvested: string
    bonus: string
    name?: string
    symbol?: string
}


export const airdropClaimStatusQuery = selectorFamily({
    key: "airdropClaimStatusQuery",
    get: ({stage, contract}:{stage: string | undefined, contract: string}) => async ({ get }) => {
        const address  = get(addressState)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{is_claimed: boolean}| undefined>(
            {
                contract: contract,
                msg: { is_claimed: { stage: stage, address: address} },
            },
            "airdropClaimStatusQuery"
        )
    },
})

export const aprQuery = selector({
    key: "aprQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<any>(
            {
                contract: contracts['loop_farm_staking'],
                msg: { apry: {} },
            },
            "aprQuery"
        )
    },
})


export const harvestQuery = selector({
    key: "harvestQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const address  = get(addressState)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<LISTHarvest[] | undefined>(
            {
                contract: contracts['loop_farm_staking'],
                msg: { all_rewards: { name: address, time: Math.floor(
                            Date.now() / 1000
                        )} },
            },
            "harvestQuery"
        )
    },
})

export const lpLimitsQuery = selectorFamily({
    key: "lpLimitsQuery",
    get: ({ pair }:{pair?: string}) => async ({ get }) => {
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<any | undefined>(
            {
                contract: pair ?? "",
                msg: { limits: {}},
            },
            "lpLimitsQuery"
        )
    },
})

export const stakedByUserQuery = selectorFamily({
    key: "stakedByUserQuery",
    get: ({ token, contract, address }:{ token: string,
        contract: string,
        address: string}) => async ({ get }) => {
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<STAKED[] | undefined>(
            {
                contract: contract ?? "",
                msg: { total_staked_by_user: { asset: {token: { contract_addr: token ?? "" }, name: address ?? "" }}},
            },
            "stakedByUserQuery"
        )
    },
})

export const communityCurrentBalanceQuery = selector({
    key: "communityCurrentBalanceQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ balance: string }>(
            {
                contract: contracts["loopToken"] ?? "",
                msg: { balance: { address: contracts["community"] ?? "" } },
            },
            "communityCurrentBalanceQuery"
        )
    },
})

const communityCurrentBalanceState = atom<any>({
    key: "communityCurrentBalanceState",
    default: { balance: "0"},
})


export const useCommunityCurrentBalance = () => {
    return useStore(communityCurrentBalanceQuery, communityCurrentBalanceState)
}


export const devTokenBalanceQuery = selectorFamily({
    key: "devTokenBalanceQuery",
    get: ({ devToken }:{ devToken: string}) => async ({ get }) => {
        try{
            get(priceKeyIndexState)
            const address  = get(addressState)
            const getContractQuery = get(getContractQueryQuery)
            return await getContractQuery<{ balance: string } | undefined>(
                {
                    contract: devToken ?? "",
                    msg: { balance: { address: address }},
                },
                "devTokenBalanceQuery"
            )
        }catch (err){
            return { balance: "0" }
        }
    },
})


const devTokenBalanceState = atom<{ balance: string; } | Dictionary<{ balance: string; } | undefined> | undefined>({
    key: "devTokenBalanceState",
    default: { balance: "0"},
})

export const useDevTokenBalance = (devToken: string) => {
    useStore(devTokenBalanceQuery({ devToken}), devTokenBalanceState)
}

export const rewardListQuery = selector({
    key: "rewardListQuery",
    get: async ({ get }) => {
        const address  = get(addressState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ balance: string } | undefined>(
            {
                contract: contracts["loop_staking"] ?? "",
                msg: { reward: { name: address }},
            },
            "rewardListQuery"
        )
    },
})


const rewardListState = atom<any>({
    key: "rewardListState",
    default: { balance: "0"},
})

export const useRewardList = () =>{
    return useStore(rewardListQuery, rewardListState)
}

export const stakedLoopQuery = selector({
    key: "stakedLoopQuery",
    get: async ({ get }) => {
        const address  = get(addressState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ balance: string } | undefined>(
            {
                contract: contracts["loop_staking"] ?? "",
                msg: { stake: { name: address }},
            },
            "stakedLoopQuery"
        )
    },
})

const stakedLoopState = atom<any>({
    key: "stakedLoop",
    default: undefined,
})

export const useStakedLoop = () => {
    return useStore(stakedLoopQuery, stakedLoopState)
}

export const useUnstakedQueueQuery = selector({
    key: "useUnstakedQueueQuery",
    get: async ({ get }) => {
        const address  = get(addressState)
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<PendingQueue | undefined>(
            {
                contract: contracts["loop_staking"] ?? "",
                msg: { unstake_list: { name: address }},
            },
            "useUnstakedQueueQuery"
        )
    },
})

const useUnstakedQueueState = atom<PendingQueue | Dictionary<PendingQueue | undefined> | undefined>({
    key: "stakedLoop",
    default: undefined,
})

export const useUnstakedQueue = () => {
    const [timeRequired, setTimeRequired] = useState("")
    const [canClaim, setCanClaim] = useState(false)
    const { contents: pendingUnstake } =  useStore(useUnstakedQueueQuery, useUnstakedQueueState)

    useEffect(() => {
        const currentTime = Math.floor(Date.now() / 1000)
        //@ts-ignore
        const timeDiff = minus(currentTime, pendingUnstake !== undefined ? pendingUnstake?.time.toString() : '0')
        const hour24 = 300 - parseInt(timeDiff)
        setCanClaim(hour24 < 0)
        setTimeRequired(getHumanTime(hour24 * 1000))
    }, [pendingUnstake])

    return {
        pendingUnstake,
        timeRequired,
        canClaim,
    }
}

export const tokenBalanceByLoopStakeQuery = selectorFamily({
    key: "tokenBalanceByLoopStakeQuery",
    get: ({ token }: { token: string }) => async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<{ balance: string } | undefined>(
            {
                contract: token ?? "",
                msg: { balance: { address: contracts["loop_staking"] ?? "" }},
            },
            "tokenBalanceByLoopStakeQuery"
        )
    },
})

const tokenBalanceByLoopStakeState = atom<undefined | { balance: string }>({
    key: "tokenBalanceByLoopStakeState",
    default: { balance: "0" },
})

export const useTokenBalanceByLoopStake = (token: string) => {
    const { contents } =  useStore(tokenBalanceByLoopStakeQuery({token}), tokenBalanceByLoopStakeState)
    return contents?.balance ?? "0"
}

// Airdrop

export const airdropTotalStakedQuery = selector({
    key: "airdropTotalStakedQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<string | undefined>(
            {
                contract: contracts["loop_staking"] ?? "",
                msg: { total_staked: {}},
            },
            "airdropTotalStakedQuery"
        )
    },
})

const airdropTotalStakedState = atom<string | undefined>({
    key: "airdropTotalStakedState",
    default: "0",
})

export const useAirdropTotalStaked = () => {
    return useStore(airdropTotalStakedQuery, airdropTotalStakedState)
}

// FARM

export const claimBonusQuery = selector({
    key: "claimBonusQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<ClaimBonusList[]>(
            {
                contract: contracts["loop_staking"] ?? "",
                msg: { total_staked: {}},
            },
            "claimBonusQuery"
        )
    },
})

const claimBonusState = atom<Dictionary<ClaimBonusList[] | undefined> | undefined | ClaimBonusList[]>({
    key: "claimBonusState",
    default: undefined,
})

export const useClaimBonus = () => {
    return  useStore(claimBonusQuery, claimBonusState)
}

export const useClaimBonusList = () => {
    const [list, setList] = useState<ClaimBonusList[]>([])
    const { contents: data } = useClaimBonus()

    useMemo(() => {
        //@ts-ignore
        data !== undefined && data?.map(async (li: ClaimBonusList) => {
            const { contract_addr } = li.asset.token
            const url = `https://tequila-fcd.terra.dev/wasm/contracts/${contract_addr}/store?query_msg=%7B%22token_info%22%3A%7B%7D%7D`
            ;(await contract_addr) !== undefined &&
            fetch(url)
                .then((data) => data.json())
                .then((data) => {
                    const { result } = data
                    const dataObj = {
                        symbol: result?.symbol ?? "",
                        name: result?.name ?? "",
                        ...li,
                    }

                    const exist = list.find(
                        (item) => item.asset.token.contract_addr === contract_addr
                    )
                    if (!exist) {
                        setList((oldArray) => [
                            ...oldArray.filter(
                                (item) => item.asset.token.contract_addr !== contract_addr
                            ),
                            dataObj,
                        ])
                    }
                })
        })
    }, [data])

    return {
        bonusList: list,
    }
}

// POOL

export const poolUsePairPoolRowQuery = selectorFamily({
    key: "poolUsePairPoolRowQuery",
    get: ({ pair }:{ pair: string }) => async ({ get }) => {
        try {
            const getContractQuery = get(getContractQueryQuery)
            return await getContractQuery<PairPool | undefined>(
                {
                    contract: pair ?? "",
                    msg: { pool: {}},
                },
                "poolUsePairPoolRowQuery"
            )
        }catch (e){
            return undefined
        }
    },
})

export const poolUsePairPoolListQuery = selector({
    key: "poolUsePairPoolListQuery",
    get: async ({ get }) => {
        get(priceKeyIndexState)

        const getListedContractQueries = get(getListedPairV2ContractQueriesQuery)
        return await getListedContractQueries<PairPool[] | undefined>(
            ({ pair }: { pair: string }) => ({ contract: pair, msg: {
                    pool: {},
                } }),
            "poolUsePairPoolListQuery"
        )
    }
})

const poolPairPoolState = atom<PairPool | undefined>({
    key: "poolPairPoolState",
    default: undefined,
})

export const usePoolPairPool = (pair: string ) => {
    return  useStore(poolUsePairPoolRowQuery({pair}), poolPairPoolState)
}

const poolPairPoolListState = atom<any>({
    key: "poolPairPoolListState",
    default: undefined,
})

export const usePoolPairPoolList = () => {
    return  useStore(poolUsePairPoolListQuery, poolPairPoolListState)
}

export const stakingReward = selector({
    key: "stakingReward",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const address  = get(addressState)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<StakingReward | undefined>(
            {
                contract: contracts["staking"] ?? "",
                msg: { reward_info: { staker: address }},
            },
            "stakingReward"
        )
    },
})

const stakingRewardState = atom<StakingReward | undefined | Dictionary<StakingReward | undefined>>({
    key: "stakingRewardState",
    default: undefined,
})

export const useStakingReward = () => {
    return  useStore(stakingReward, stakingRewardState)
}

export const govStakeQuery = selector({
    key: "govStakeQuery",
    get: async ({ get }) => {
        const { contracts } = get(protocolQuery)
        const address  = get(addressState)
        const getContractQuery = get(getContractQueryQuery)
        return await getContractQuery<GovStaker | undefined>(
            {
                contract: contracts["gov"] ?? "",
                msg: { staker: { address: address} },
            },
            "govStakeQuery"
        )
    },
})

const govStakeState = atom<GovStaker | undefined | Dictionary<GovStaker | undefined>>({
    key: "govStakeState",
    default: undefined,
})

export const useGovStake = () => {
    return  useStore(govStakeQuery, govStakeState)
}

export const getListedPairV2ContractQueriesQuery = selector({
    key: "getListedPairV2ContractQueriesQuery",
    get: ({ get }) => {
        const contracts  = get(contractsV2Query)
        const getContractQueries = get(getContractQueriesQuery)
        return async <Parsed>(fn: GetTokenInfoDocument, name: string) => {
            const document = alias(
                contracts ? contracts
                    // .filter((item) => !item.isNative)
                    .filter((item) => fn(item))
                    .map((item) => ({ name: item.pair, ...fn(item) })) : [],
                name
            )

            return await getContractQueries<Parsed>(document, name)
        }
    },
})

export const getListedLPV2ContractQueriesQuery = selector({
    key: "getListedLPV2ContractQueriesQuery",
    get: ({ get }) => {
        const contracts  = get(contractsV2Query)
        const getContractQueries = get(getContractQueriesQuery)
        return async <Parsed>(fn: GetTokenInfoDocument, name: string) => {
            const document = alias(
                contracts ? contracts
                    // .filter((item) => !item.isNative)
                    .filter((item) => fn(item))
                    .map((item) => ({ name: item.lp, ...fn(item) })) : [],
                name
            )

            return await getContractQueries<Parsed>(document, name)
        }
    },
})

export const stakedByUserFarmQueryFarm4 = selector({
    key: "stakedByUserFarmQueryFarm4",
    get: async ({ get }) => {
                get(priceKeyIndexState)
                const address = get(addressState)
                const { contracts } = get(protocolQuery)
                if (address) {
                    const getListedContractQueries = get(getListedLPV2ContractQueriesQuery)
                    return await getListedContractQueries<string | undefined>(
                        ({ lp }: { lp: string }) => ({
                            contract: contracts['loop_farm_staking_v4'] ?? "",
                            msg: {
                                query_staked_by_user: { wallet: address, staked_token: lp },
                            },
                        }),'stakedByUserFarmQueryFarm4')
                }
            },
})

const stakedByUserFarmQueryFarm4State = atom<Dictionary<string | undefined> | undefined>({
    key: "stakedByUserFarmQueryFarm4State",
    default: undefined,
})

export const useStakedByUserFarmQueryFarm4 = () => {
    return useStore(
        stakedByUserFarmQueryFarm4,
        stakedByUserFarmQueryFarm4State
    )
}

export const useFindStakedByUserFarmQueryFarm4 = () => {
    const {contents: stakedByUserFarm} = useStakedByUserFarmQueryFarm4()
    return (lpToken: string) => stakedByUserFarm?.[lpToken] ?? "0"
}


export const getTotalStakedForFarming4Query = selectorFamily({
    key: "getTotalStakedForFarming4Query",
    get:
        (type: FarmContractTYpe) =>
            async ({ get }) => {
                get(priceKeyIndexState)
                const { contracts } = get(protocolQuery)
                const getTerraListedContractQueries = get(getListedLPV2ContractQueriesQuery)
                if (getTerraListedContractQueries) {
                    return await getTerraListedContractQueries<string | undefined>(
                        ({lp}: {lp: string}) => ({
                            contract: contracts[type] ?? "",
                            msg: { query_total_staked: { staked_token: lp } },
                            name: lp,
                        }),
                        "getTotalStakedForFarming4Query"
                    )
                }
            },
})

export const queryGetUserAutoCompoundSubriptionFarm4Query = selectorFamily({
    key: "queryGetUserAutoCompoundSubriptionFarm4Query",
    get:
        (type: FarmContractTYpe) =>
            async ({ get }) => {
                get(priceKeyIndexState)
                const { contracts } = get(protocolQuery)
                const address = get(addressState)
                const getTerraListedContractQueries = get(getListedLPV2ContractQueriesQuery)
                if (getTerraListedContractQueries) {
                    return await getTerraListedContractQueries<any>(
                        ({lp}: {lp: string}) => ({
                            contract: contracts[type] ?? "",
                            msg: {
                                query_get_user_auto_compound_subription: {
                                    user_address: address,
                                    pool_address: lp,
                                },
                            },
                            name: lp,
                        }),
                        "queryGetUserAutoCompoundSubriptionFarm4Query"
                    )
                }
            },
})

const queryGetUserAutoCompoundSubriptionFarm4State = atomFamily<any,FarmContractTYpe>({
    key: "queryGetUserAutoCompoundSubriptionFarm4State",
    default: {},
})

export const useGetUserAutoCompoundSubriptionFarm4 = (type: FarmContractTYpe) => {
    return useStore(
        queryGetUserAutoCompoundSubriptionFarm4Query(type),
        queryGetUserAutoCompoundSubriptionFarm4State(type)
    )
}
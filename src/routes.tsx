import {Route, RouteProps, Switch} from "react-router-dom"
import {Dictionary} from "ramda"

import Dashboard from "./pages/Dashboard"
import Info from "./pages/Info"
import Auth from "./pages/Auth"
import My from "./pages/My"
import Send from "./pages/Send"
import Airdrop from "./pages/Airdrop"

import Reward from "./pages/Reward"
import Caution from "./forms/Caution"
import Data from "./tools/Data"
import Tool from "./tools/Tool"
import Exchange from "./pages/Exchange"
import Admin from "./pages/Admin"
import ClaimAirdrop from "./pages/ClaimAirdrop"
import PoolDynamic from "./pages/PoolDynamic"
import Claim from "./pages/Farm/Claim"
// import FarmingCommingSoon from "./components/FarmingCommingSoon"
import ClaimBonus from "./pages/Farm/ClaimBonus"

import dashboard_icon from "./images/icons/dashbaord.png"
import airdropClaim_Icon from "./images/icons/Claiming.png"
import airdropLoopIconleft from "./images/coins/loop_icon.svg"
import airdropLoopIconright from "./images/coins/loop_icon.svg"
import my_icon from "./images/icons/24-mypage.png"
import pool_icon from "./images/icons/24-pool.png"
import swap_icon from "./images/icons/24-swap.png"
import farm_icon from "./images/icons/24farmpink.svg"
import staking_icon from "./images/icons/24-stake.png"
import pylon_icon from "./images/icons/10Blue.png"
import dashboard_icon2 from "./images/icons/1.png"
import MIM_icon from "./images/coins/MIM.png"
import ALTE_icon from "./images/coins/alte.webp"
import farm_icon2 from "./images/icons/farmpink.svg"
import my_icon2 from "./images/icons/3.png"
import pool_icon2 from "./images/icons/4.png"
import swap_icon2 from "./images/icons/7.png"
import staking_icon2 from "./images/icons/6.png"
import pylon_icon2 from "./images/icons/10.png"
import AirdropPink from "./images/icons/airdropPink.png"
import BuyustPink from "./images/icons/buyust.svg"
import setting_icon from "./images/icons/24-settings.png"
import logout_icon from "./images/icons/24-logout.png"
import plus_icon from "./images/icons/plus.svg"
import minus_icon from "./images/icons/minus.svg"
import harvest_icon from "./images/icons/harvest.svg"
import airdrop_icon from "./images/icons/airdropBlue.png"
import Buyust_icon from "./images/icons/buyust.png"
import Loop_icon from "./images/coins/loop_icon.svg"
import Loopr_icon from "./images/coins/loopr_icon.svg"
import Ust_icon from "./images/coins/ust.png"
import WETH_icon from "./images/coins/whETH.png"
import WBTC_icon from "./images/coins/whBTC.png"
import HALO_icon from "./images/coins/HALO.png"
import ULUNA_icon from './images/coins/luna.png'
import BLUNA from './images/coins/bLUNA.png'
import AUST from './images/coins/aUST.png'
import Mine_icon from "./images/coins/mine_icon.svg"
import Ant_icon from "./images/coins/ant_icon.png"
import LOTA_icon from "./images/coins/LOTA.png"
import MIR_icon from "./images/coins/MIR.png"
import DPH_icon from "./images/coins/DPH.png"
import TWD_icon from "./images/coins/twd_logo.png"
import SPEC_icon from "./images/coins/SPEC.png"
import STT_icon from "./images/coins/STT.png"
import KUJI_icon from "./images/coins/kuji.png"
import BETH_icon from "./images/coins/bETH.png"
import STLUNA_icon from "./images/coins/stLUNA.png"
import LUNAX_icon from "./images/coins/LunaX.png"
import LUV_icon from "./images/coins/luv.png"
import LoopStake from "./pages/LoopStake"
import MakeAirdrop from "./pages/MakeAirdrop"
import Markets from "./pages/markets/Markets"
// import Farm from "./pages/Farm"
import FarmAirdrop from "./pages/Farm/FarmAirdrop"
import FarmBeta from "./pages/FarmBeta"
import NotFound from "./components/Static/NotFound"
import * as React from "react"
import {RouteComponentProps} from "react-router"
import Distribution from "./pages/Distribution"
import MakeDistribution from "./pages/MakeDistribution"
import Farm from "./pages/Farm";
import {FarmWizardModal} from "./pages/Farm/FarmWizardModal";
import Farmv4 from "./pages/Farmv4";
import WalletGuide from "./components/WalletGuide/Wallet"

// import BuyUst from "./pages/BuyUst"
export enum MenuKey {
    DASHBOARD = "Dashboard",
    INFO = "INFO",
    AUTH = "AUTH",
    SWAP = "Swap",
    MY = "Portfolio",
    MARKETS = "Markets",
    SEND = "SEND",
    MINT = "MINT",
    POOL = "Pool",
    POOL_V2 = "Pool_v2",
    GOV = "GOVERNANCE",
    FARM = "Farm Beta",
    FARMBETA = "Farm",
    FARMV3 = "Farm V3",
    STAKE = "Stake",
    EXCHANGE = "DEX",
    PYLONRAISE = "Pylon Raise",
    ADMIN = "ADMIN",
    CLAIM = "CLAIM",
    POOL_DYNAMIC = "POOL_DYNAMIC",
    CLAIM_ALL = "CLAIM_ALL",
    CLAIM_BONUS = "CLAIM_BONUS",
    AIRDROPS = "Airdrops",
    SETTINGS = "Setting",
    LOGOUT = "Logout",
    HOME = "Home",
    TOKENS = "Tokens",
    COMMUNITY = "Community",
    WALLET = "Wallet",
    STAKING = "STAKING",
    AIRDROP = "Airdrop",
    BUYUST = "Buy UST",
    CLAIM_AIRDROP = "Claim Airdrop",
    MINELOOP = "Mine LOOP",
    CLAIM_FARM_AIRDROP = "claim farm airdrop",
    NOTFOUND = "not_found",
    LOOPR_AIRDROP = "loopr_airdrop",
    LOOP_AIRDROP = "loop_airdrop",
    LOOPR_AIRDROP_101 = "loop_airdrop_101",
    DISTRIBUTION = "Distribution",
    DISTRIBUTION_TEAM = "distribution_team",
    DISTRIBUTION_INVESTOR = "distribution_investor",
    LOOP_AIRDROP_DEC_21 = "loop_airdrop_dec_21",
    LOOPR_AIRDROP_DEC_21 = "loopr_airdrop_dec_21",
    LOOPR_AIRDROP_feb_22 = "loop_airdrop_feb_22",
    LOOPR_AIRDROP_JAN_22 = "loopr_airdrop_jan_22",
    FARM_WIZARD = "farm_wizard",
    WALLETS='wallets',
}

export const omit = [
    MenuKey.AUTH,
    MenuKey.INFO,
    MenuKey.SEND,
    MenuKey.MINELOOP,
    // MenuKey.MARKETS,
    MenuKey.PYLONRAISE,
    /*MenuKey.FARMBETA,*/
    // MenuKey.AIRDROP,
    MenuKey.MINT,
    MenuKey.GOV,
    MenuKey.EXCHANGE,
    MenuKey.ADMIN,
    MenuKey.CLAIM,
    MenuKey.POOL_DYNAMIC,
    MenuKey.CLAIM_ALL,
    MenuKey.AIRDROPS,
    MenuKey.SETTINGS,
    MenuKey.LOGOUT,
    MenuKey.CLAIM_BONUS,
    MenuKey.HOME,
    MenuKey.TOKENS,
    MenuKey.COMMUNITY,
    MenuKey.WALLET,
    MenuKey.STAKING,
    MenuKey.STAKING,
    MenuKey.CLAIM_AIRDROP,
    MenuKey.CLAIM_FARM_AIRDROP,
    MenuKey.NOTFOUND,
    MenuKey.LOOP_AIRDROP,
    MenuKey.LOOPR_AIRDROP,
    MenuKey.LOOPR_AIRDROP_101,
    // MenuKey.DISTRIBUTION,
    MenuKey.DISTRIBUTION_TEAM,
    MenuKey.DISTRIBUTION_INVESTOR,
    MenuKey.DISTRIBUTION,
    MenuKey.LOOP_AIRDROP_DEC_21,
    MenuKey.LOOPR_AIRDROP_DEC_21,
    MenuKey.LOOPR_AIRDROP_JAN_22,
    MenuKey.FARM,
    MenuKey.POOL_V2,
    MenuKey.FARM_WIZARD,
    MenuKey.WALLETS,
    MenuKey.WALLETS,
    MenuKey.LOOPR_AIRDROP_feb_22,
]

/*export const TopbarMenuKeyLabels: { [key: string]: string } = {
  [MenuKey.SWAP]: "EXCHANGE",
}*/

export const additional = [MenuKey.SETTINGS]

export const topbar = [
    // MenuKey.HOME,
    MenuKey.DASHBOARD,
    MenuKey.EXCHANGE,
    MenuKey.MY,
    MenuKey.MARKETS,
    MenuKey.POOL,
    MenuKey.FARM,
    MenuKey.PYLONRAISE,
    MenuKey.AIRDROP,
    MenuKey.STAKE,
    MenuKey.DISTRIBUTION,
    // MenuKey.MINELOOP,
    // MenuKey.TOKENS,
    // MenuKey.COMMUNITY,
    // MenuKey.WALLET,
]

export const menu: Dictionary<RouteProps> = {
    // Not included in navigation bar
    [MenuKey.DASHBOARD]: {path: "/", exact: true, component: Dashboard},
    [MenuKey.AUTH]: {path: "/auth", component: Auth},
    [MenuKey.INFO]: {path: "/info", component: Info},
    [MenuKey.SEND]: {path: "/send", component: Send},
    [MenuKey.MARKETS]: {path: "/markets", component: Markets},
    [MenuKey.FARM_WIZARD]: {path: "/farm-wizard", component: FarmWizardModal},
    // Menu
    [MenuKey.MY]: {path: "/my", component: My},
    [MenuKey.POOL]: {path: "/pool", component: PoolDynamic},
    [MenuKey.POOL_V2]: {path: "/pool-v2", component: PoolDynamic},
    [MenuKey.POOL_DYNAMIC]: {path: "/pool-dynamic", component: PoolDynamic},
    [MenuKey.STAKE]: {path: "/stake", component: LoopStake},
    // [MenuKey.GOV]: {path: "/gov", component: Gov},
    [MenuKey.SWAP]: {path: "/swap", component: Exchange},
    [MenuKey.EXCHANGE]: {path: "/exchange", component: Exchange},
    [MenuKey.FARM]: {path: "/farm", component: Farm},
    [MenuKey.FARMBETA]: {path: "/farm2", component: FarmBeta},
    [MenuKey.FARMV3]: {path: "/farm3", component: Farmv4},

    [MenuKey.CLAIM]: {path: "/claim", exact: true, component: ClaimAirdrop},
    [MenuKey.CLAIM_ALL]: {path: "/claim/all", component: Claim},
    [MenuKey.CLAIM_BONUS]: {path: "/claim/bonus", component: ClaimBonus},
    [MenuKey.STAKING]: {path: "/loop-stake", component: LoopStake},
    [MenuKey.AIRDROP]: {path: "/airdrop", component: Airdrop},
    [MenuKey.DISTRIBUTION]: {path: "/distribution", component: Distribution},

    [MenuKey.WALLETS]: {path: "/wallets", component: WalletGuide},


    // airdrops
    [MenuKey.CLAIM_AIRDROP]: {path: "/claim-airdrop", component: MakeAirdrop},
    [MenuKey.LOOP_AIRDROP]: {path: "/loop-airdrop", component: MakeAirdrop},
    [MenuKey.LOOPR_AIRDROP]: {path: "/loopr-airdrop", component: MakeAirdrop},
    [MenuKey.LOOPR_AIRDROP_101]: {path: "/loopr-airdrop-101", component: MakeAirdrop},
    [MenuKey.LOOP_AIRDROP_DEC_21]: {path: "/loop-airdrop-21", component: MakeAirdrop},
    [MenuKey.LOOPR_AIRDROP_DEC_21]: {path: "/loopr-airdrop-21", component: MakeAirdrop},
    [MenuKey.LOOPR_AIRDROP_JAN_22]: {path: "/loop-january-22-airdrop", component: MakeAirdrop},
    [MenuKey.LOOPR_AIRDROP_feb_22]: {path: "/loop-feb-22-airdrop", component: MakeAirdrop},

    // distributions
    [MenuKey.DISTRIBUTION_TEAM]: {path: "/team-distribution", component: MakeDistribution},
    [MenuKey.DISTRIBUTION_INVESTOR]: {path: "/investor-distribution", component: MakeDistribution},

    [MenuKey.CLAIM_FARM_AIRDROP]: {
        path: "/claim-farm-airdrop",
        component: FarmAirdrop,
    },
    // [MenuKey.BUYUST]: { path: "/buyust", component: BuyUst },

    // For test
    reward: {path: "/reward", component: Reward},
    caution: {path: "/caution", component: Caution},

    // For developers
    data: {path: "/data", component: Data},
    tool: {path: "/tool", component: Tool},
    [MenuKey.NOTFOUND]: {path: "/not-found", exact: true, component: NotFound},

    //admin
    [MenuKey.ADMIN]: {path: "/admin", component: Admin},
    [MenuKey.SETTINGS]: {path: "/", component: Admin},
    [MenuKey.LOGOUT]: {path: "/", component: Admin},


    // topbar routes
    [MenuKey.HOME]: {path: "/#", component: undefined},
    [MenuKey.TOKENS]: {path: "/#", component: undefined},
    [MenuKey.COMMUNITY]: {path: "/#", component: undefined},
    [MenuKey.WALLET]: {path: "/#", component: undefined},


    [MenuKey.PYLONRAISE]: {},
}

export const icons: Dictionary<string> = {
    // Not included in navigation bar
    [MenuKey.DASHBOARD]: dashboard_icon,
    [MenuKey.MY]: my_icon,
    [MenuKey.POOL]: pool_icon,
    [MenuKey.SWAP]: swap_icon,
    [MenuKey.FARM]: farm_icon,
    [MenuKey.FARMV3]: farm_icon,
    [MenuKey.FARMBETA]: farm_icon,
    [MenuKey.STAKE]: staking_icon,
    [MenuKey.PYLONRAISE]: pylon_icon,
    [MenuKey.AIRDROP]: airdrop_icon,
    [MenuKey.BUYUST]: Buyust_icon,
    [MenuKey.SETTINGS]: setting_icon,
    [MenuKey.LOGOUT]: logout_icon,
    [MenuKey.MARKETS]: airdrop_icon,
    // [MenuKey.MINELOOP]: staking_icon,
    [MenuKey.DISTRIBUTION]: airdrop_icon,
    plus: plus_icon,
    minus: minus_icon,
    harvest: harvest_icon,
    airdrop: airdropClaim_Icon,
    airLoopIconLeft: airdropLoopIconleft,
    airLoopIconRight: airdropLoopIconright,
}

export const changedIcons: Dictionary<string> = {
    // Not included in navigation bar
    [MenuKey.DASHBOARD]: dashboard_icon2,
    [MenuKey.MY]: my_icon2,
    [MenuKey.POOL]: pool_icon2,
    [MenuKey.FARM]: farm_icon2,
    [MenuKey.FARMV3]: farm_icon2,
    [MenuKey.FARMBETA]: farm_icon2,
    [MenuKey.STAKE]: staking_icon2,
    [MenuKey.PYLONRAISE]: pylon_icon2,
    [MenuKey.AIRDROP]: AirdropPink,
    [MenuKey.BUYUST]: BuyustPink,
    [MenuKey.SWAP]: swap_icon2,
    [MenuKey.MARKETS]: AirdropPink,
    // [MenuKey.MINELOOP]: staking_icon2,
    [MenuKey.DISTRIBUTION]: AirdropPink,
    LOOP: Loop_icon,
    LOOPR: Loopr_icon,
    UUSD: Ust_icon,
    MINE: Mine_icon,
    ANC: Ant_icon,
    ULUNA: ULUNA_icon,
    LUNA: ULUNA_icon,
    BLUNA: BLUNA,
    AUST: AUST,
    UST: Ust_icon,
    WHETH: WETH_icon,
    WETH: WETH_icon,
    WHWETH: WETH_icon,
    wETH: WETH_icon,
    WHBTC: WBTC_icon,
    WHWBTC: WBTC_icon,
    wBTC: WBTC_icon,
    WBTC: WBTC_icon,
    HALO: HALO_icon,
    LOTA: LOTA_icon,
    MIR: MIR_icon,
    DPH: DPH_icon,
    TWD: TWD_icon,
    SPEC: SPEC_icon,
    STT: STT_icon,
    MIM: MIM_icon,
    WHMIM: MIM_icon,
    wMIM: MIM_icon,
    WMIM: MIM_icon,
    whMIM: MIM_icon,
    ALTE: ALTE_icon,
    KUJI: KUJI_icon,
    bETH: BETH_icon,
    BETH: BETH_icon,
    LUNAX: LUNAX_icon,
    STLUNA: STLUNA_icon,
    LUV: LUV_icon,
}

export const getPath = (key: MenuKey) =>
    menu[key] ? (menu[key]?.path as string) : ""

export const getComponent = (
    key: MenuKey
):
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
    | undefined => (menu[key] ? menu[key]?.component : undefined)

export const getICon = (key: MenuKey) => icons[key] ?? ""
export const getICon2 = (key: string) => changedIcons[key] ?? ""

export default (routes: Dictionary<RouteProps> = menu, path: string = "") => (
    <Switch>
        {Object.entries(routes).map(([key, route]) => (
            <Route {...route} path={path + route.path} key={key}/>
        ))}

        <Route component={getComponent(MenuKey.NOTFOUND)}/>
    </Switch>
)

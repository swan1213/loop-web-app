import { RouteProps, useRouteMatch } from "react-router-dom"

import routes from "../routes"
import AdminHome from "./Admin/AdminHome"
import AdminAirdrops from "./Admin/AdminAirdrops"
import GiveWeight from "./GiveWeight"
import TVL from "./TVL"
import AdminFarms from "./Admin/AdminFarms"
import AssignFarmRewards from "./Admin/AssignFarmRewards"
import RewardStaking from "./Admin/RewardStaking"
import AddStakeableTokens from "./Admin/AddStakeableToken"
import AddDistributionToken from "./Admin/AddDistributionToken"
import UpdateLockTime from "./Admin/UpdateLockTime";
import RewardsInfo from "./Admin/RewardsInfo";

export enum MenuKey {
  INDEX = "Admin",
  AIRDROPS = "Airdrops",
  WEIGHT = "Weight",
  TVL = "TVL",
  FARMS = "Farms",
  ASSIGNFARMREWARDS = "3-Assign_FARMING_Rewards",
  STAKING_REWARD = "staking_reward",
  ADD_STAKEABLE_TOKENS = "1-add_stakeable_token",
  ADD_DISTRIBUTION_TOKEN = "2-add_distribution_token",
  UPDATE_LOCK_TIME = "update_lock_time",
  VIEW_REWARD_TIME = "rewards_info",
}

export enum Caption {
  GO_BACK = "Go back to Admin",
}

export const menu: Record<MenuKey, RouteProps> = {
  [MenuKey.INDEX]: { path: "/", exact: true, component: AdminHome },
  [MenuKey.AIRDROPS]: {
    path: "/airdrops",
    component: AdminAirdrops,
    exact: true,
  },
  [MenuKey.WEIGHT]: {
    path: "/weight",
    component: GiveWeight,
    exact: true,
  },
  [MenuKey.TVL]: {
    path: "/tvl",
    component: TVL,
    exact: true,
  },
  [MenuKey.FARMS]: {
    path: "/farms",
    component: AdminFarms,
    exact: true,
  },
  [MenuKey.ASSIGNFARMREWARDS]: {
    path: "/assign-rewards",
    component: AssignFarmRewards,
    exact: true,
  },
  [MenuKey.STAKING_REWARD]: {
    path: "/staking-reward",
    component: RewardStaking,
    exact: true,
  },
  [MenuKey.ADD_STAKEABLE_TOKENS]: {
    path: "/add-stakeable-tokens",
    component: AddStakeableTokens,
    exact: true,
  },
  [MenuKey.ADD_DISTRIBUTION_TOKEN]: {
    path: "/add-distribution-token",
    component: AddDistributionToken,
  },
  [MenuKey.UPDATE_LOCK_TIME]: {
    path: "/update-lock-time",
    component: UpdateLockTime,
  },
  [MenuKey.VIEW_REWARD_TIME]: {
    path: "/rewards-info",
    component: RewardsInfo
  },
}

const Admin = () => {
  const { path } = useRouteMatch()
  return routes(menu, path)
}

export default Admin

import { Contract, providers } from "ethers";
import UiPoolDataProvider from "./abis/UiPoolDataProvider.json";
import LendingPool from "./abis/LendingPool.json";
import Multicall from "./abis/Multicall.json";

export const JsonProvider = new providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ESpaceRpcUrl
);

export const LendingPoolContract = new Contract(
  process.env.NEXT_PUBLIC_LendingPoolAddress as string,
  LendingPool,
  JsonProvider
);
export const UiPoolDataContract = new Contract(
  process.env.NEXT_PUBLIC_UiPoolDataProviderAddress as string,
  UiPoolDataProvider,
  JsonProvider
);
export const MulticallContract = new Contract(
  process.env.NEXT_PUBLIC_MulticallContract as string,
  Multicall,
  JsonProvider
);

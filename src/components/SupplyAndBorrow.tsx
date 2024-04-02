import { Input, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  UiPoolDataContract,
  // LendingPoolContract,
  MulticallContract,
} from "../utils/contracts";
import { TOKENS } from "../utils";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import { useTranslations } from "next-intl";

const { Link } = Typography;
const { Search } = Input;

interface DataType {
  tokenAddress: string;
  tokenName: string;
  supplying: string;
  borrowing: string;
  Index: string;
}

export default function SupplyAndBorrow() {
  const t = useTranslations("SupplyAndBorrow");
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "Index",
        key: "Index",
        render(text, record, index) {
          return index;
        },
        width: 80,
      },
      {
        title: t("token"),
        dataIndex: "tokenName",
        key: "tokenName",
        render(text, record, index) {
          return (
            <Link
              href={`${process.env.NEXT_PUBLIC_ESpaceScanUrl}/token/${record.tokenAddress}`}
              target="_blank"
            >
              {text}
            </Link>
          );
        },
      },
      {
        title: t("supplying"),
        dataIndex: "supplying",
        key: "supplying",
      },
      {
        title: t("borrowing"),
        dataIndex: "borrowing",
        key: "borrowing",
      },
    ],
    [t]
  );

  useEffect(() => {
    async function main() {
      if (!ethers.utils.isAddress(value)) return;

      const account = value;
      setLoading(true);

      const promises = [
        // [
        //   process.env.NEXT_PUBLIC_LendingPoolAddress,
        //   LendingPoolContract.interface.encodeFunctionData(
        //     "getUserAccountData",
        //     [account]
        //   ),
        // ],
        // [
        //   process.env.NEXT_PUBLIC_UiPoolDataProviderAddress,
        //   UiPoolDataContract.interface.encodeFunctionData("getReservesData", [
        //     process.env.NEXT_PUBLIC_LendingPoolAddressesProviderAddress,
        //     account,
        //   ]),
        // ],
        [
          process.env.NEXT_PUBLIC_UiPoolDataProviderAddress,
          UiPoolDataContract.interface.encodeFunctionData(
            "getUserReservesData",
            [
              process.env.NEXT_PUBLIC_LendingPoolAddressesProviderAddress,
              account,
            ]
          ),
        ],
      ];
      const aggregateData = await MulticallContract.callStatic.aggregate(
        promises
      );

      const UiPoolData = UiPoolDataContract.interface.decodeFunctionResult(
        "getUserReservesData",
        aggregateData?.returnData[0]
      )[0];

      const data = UiPoolData.map((d: any) => {
        return {
          key: d.underlyingAsset,
          tokenAddress: d.underlyingAsset,
          tokenName: TOKENS[d.underlyingAsset],
          supplying: ethers.utils.formatEther(d.scaledATokenBalance.toString()),
          borrowing: ethers.utils.formatEther(d.scaledVariableDebt.toString()),
        };
      }).filter((d: any) => !(d.supplying == "0.0" && d.borrowing == "0.0"));

      setData(data);
      setLoading(false);
    }

    main().catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (!value.trim() || ethers.utils.isAddress(value)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }

    if (!value.trim()) {
      setData([]);
    }

    setValue(value);
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-xl">{t("title")}</h1>
      <Search
        className="mt-4"
        placeholder={t("placeholder")}
        value={value}
        onChange={handleChange}
        status={isValid ? "" : "error"}
        loading={loading}
        allowClear
      ></Search>
      {isValid ? null : (
        <span className="text-sm text-red-500">{t("errMsg")}</span>
      )}
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        loading={loading}
      />
    </div>
  );
}

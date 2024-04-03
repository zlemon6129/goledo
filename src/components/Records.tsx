// @ts-ignore
import csv from "../data/reimbursementRecords.csv";
import { Input, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslations } from "next-intl";

const { Link, Paragraph } = Typography;

const data = csv
  .filter((d: any) => d.To !== "0x3546e41d75deba8ea350d11572b50a41ddde1be8")
  .map((d: any, index: number) => ({ ...d, Index: index }));

interface DataType {
  To: string;
  DateTime: string;
  "Value(CFX)": string;
  Index: string;
}

export default function Records() {
  const t = useTranslations("Records");

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "Index",
        key: "Index",
        render(text, record, index) {
          return text;
        },
        width: 80,
      },
      {
        title: t("account"),
        dataIndex: "To",
        key: "To",
        render(text, record, index) {
          return (
            <Paragraph copyable={{ text }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_ESpaceScanUrl}/address/${text}`}
                target="_blank"
              >
                {text}
              </Link>
            </Paragraph>
          );
        },
      },
      {
        title: t("value"),
        dataIndex: "Value(CFX)",
        key: "Value(CFX)",
        render(text, record, index) {
          return `${text} CFX`;
        },
      },
      {
        title: t("dateTime"),
        dataIndex: "DateTime",
        key: "DateTime",
      },
    ],
    [t]
  );

  return (
    <div className="w-full">
      <h1 className="text-xl">{t("title")}</h1>
      <span className="text-gray-500">{t("notes")}</span>
      <Table
        className="mt-4"
        dataSource={data}
        columns={columns}
        rowKey={"To"}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

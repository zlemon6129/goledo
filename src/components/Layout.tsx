import { useTranslations } from "next-intl";
import { Layout, Flex, Dropdown, Space } from "antd";
import { DownOutlined, SmileOutlined, GlobalOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";

const { Header, Content } = Layout;

const items: MenuProps["items"] = [
  {
    key: "en",
    label: (
      <Link href="/" locale="en">
        English
      </Link>
    ),
  },
  {
    key: "zh",
    label: (
      <Link href="/" locale="zh">
        中文
      </Link>
    ),
  },
];

export default function MyLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const t = useTranslations("Header");

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#999",
        }}
        className="flex justify-between"
      >
        <span className="text-2xl">{t("title")}</span>

        <Dropdown menu={{ items }} className="text-black">
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <GlobalOutlined className="text-xl text-white" />
            </Space>
          </a>
        </Dropdown>
      </Header>
      <Content>{children}</Content>
      {/* <Footer style={footerStyle}>Footer</Footer> */}
    </Layout>
  );
}

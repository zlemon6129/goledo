import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import Layout from "../components/Layout";
import theme from "../theme/themeConfig";
import { ConfigProvider } from "antd";
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";
import zhCNLocale from "antd/es/locale/zh_CN";
import enUSLocale from "antd/es/locale/en_US";
import "@/styles/globals.css";

type AppOwnProps = { messages: any };
function MyApp({
  Component,
  pageProps,
  messages,
}: AppProps & { messages: any }) {
  const router = useRouter();

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Europe/Vienna"
      messages={messages}
    >
      <ConfigProvider
        theme={theme}
        locale={router.locale === "en" ? enUSLocale : zhCNLocale}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
    </NextIntlClientProvider>
  );
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  return {
    ...ctx,
    messages: (await import(`../locale/${context.ctx.locale}.json`)).default,
  };
};

export default MyApp;

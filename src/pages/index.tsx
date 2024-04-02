import React from "react";
import SupplyAndBorrow from "../components/SupplyAndBorrow";
import Records from "../components/Records";
import Head from "next/head";

export default function Home() {
  return (
    <div className="w-full p-10">
      <Head>
        <title>Goledo</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <SupplyAndBorrow></SupplyAndBorrow>
      <div className="m-10"></div>
      <Records></Records>
    </div>
  );
}

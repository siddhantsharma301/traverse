import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { WidgetProps } from "@worldcoin/id";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

interface Props {
  data: any[];
}

export default function Home({ data }: Props) {
  const [input, setInput] = useState<string>("");
  return (
    <div className={styles.container}>
      <Head>
        <title>Traverse</title>
        <meta
          name="description"
          content="Smart contract security report generator"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title_recent}>Generate Security Report</h1>

        <input type={"text"} placeholder="Insert Contract Address" value={input} onChange={(e)=>setInput(e.target.value)} style={{}}/>
      </main>
    </div>
  );
}

import Head from "next/head";
import { useRouter } from 'next/router'
import styles from "../styles/Home.module.css";
import { WidgetProps } from "@worldcoin/id";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import Button from "@material-ui/core/Button";

interface Props {
  data: any[];
}

export default function Home({ data }: Props) {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const load = async (response: any) => {
    setLoading(true)
  }

  return (
    (!loading) ? (

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
          <h1 className={styles.generate_title}>Generate Security Report</h1>

          <input className={styles.text_box} type={"text"} placeholder="Insert Contract Address" value={input} onChange={(e) => setInput(e.target.value)} style={{}} />
          <Button variant="contained" onClick={(e) => {setLoading(true); router.push("/contracts/" + input);}}>Submit</Button>
        </main>
      </div>
    ) : (
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
          <h1 className={styles.title_recent}>
            Generating Security Report...
          </h1>
          <h4 className={styles.vote_title}>This may take upto 30 seconds...</h4>
        </main>
      </div>
    )
  );
}

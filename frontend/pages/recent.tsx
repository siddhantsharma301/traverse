import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { WidgetProps } from '@worldcoin/id'
import dynamic from "next/dynamic";


const WorldIDWidget = dynamic<WidgetProps>(
  () => import('@worldcoin/id').then((mod) => mod.WorldIDWidget),
  { ssr: false }
)

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Traverse</title>
        <meta name="description" content="Smart contract security report generator" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title_recent}>
          View Recent Contracts
        </h1>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card_recent}>
            <h2>Contract #1 &rarr;</h2>
            <p>Address: 0xac7df37a43fab1b130318bbb761861b8357650db2e2c6493b73d6da3d9581077</p>
          </a>
          <a href="https://nextjs.org/docs" className={styles.card_recent}>
            <h2>Contract #2 &rarr;</h2>
            <p>Address: 0xac7df37a43fab1b130318bbb761861b8357650db2e2c6493b73d6da3d9581077</p>
          </a>
          <a href="https://nextjs.org/docs" className={styles.card_recent}>
            <h2>Contract #3 &rarr;</h2>
            <p>Address: 0xac7df37a43fab1b130318bbb761861b8357650db2e2c6493b73d6da3d9581077</p>
          </a>
          <a href="https://nextjs.org/docs" className={styles.card_recent}>
            <h2>Contract #4 &rarr;</h2>
            <p>Address: 0xac7df37a43fab1b130318bbb761861b8357650db2e2c6493b73d6da3d9581077</p>
          </a>
          <a href="https://nextjs.org/docs" className={styles.card_recent}>
            <h2>Contract #5 &rarr;</h2>
            <p>Address: 0xac7df37a43fab1b130318bbb761861b8357650db2e2c6493b73d6da3d9581077</p>
          </a>
          <a href="https://nextjs.org/docs" className={styles.card_recent}>
            <h2>Contract #6 &rarr;</h2>
            <p>Address: 0xac7df37a43fab1b130318bbb761861b8357650db2e2c6493b73d6da3d9581077</p>
          </a>



        </div>


        <WorldIDWidget
          actionId="wid_staging_69e75b2d27bd76510d5752a719fde7e8" // obtain this from developer.worldcoin.org
          signal="my_signal"
          enableTelemetry
          onSuccess={(verificationResponse) => console.log(verificationResponse)}
          onError={(error) => console.error(error)}
          debug={true} // to aid with debugging, remove in production
        />

      </main>

      <footer className={styles.footer}>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with
          <span className={styles.logo}>
            <Image src="/heart.png" alt="Heart Logo" width={20} height={20} />
          </span>
          {' '}at ETHSF
        </a>
      </footer>
    </div>
  )
}

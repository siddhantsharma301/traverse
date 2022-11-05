import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Sonder</title>
        <meta name="description" content="Smart contract security verifier" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Sonder
        </h1>

        <p className={styles.description}>
          Generate automated security reports for smart contracts.{' '}
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>View Recent Contracts &rarr;</h2>
            <p>View recently generated security reports on contracts.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Generate a New Report &rarr;</h2>
            <p>Verify the security of your contract and detect common bugs.</p>
          </a>

        </div>
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

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { WidgetProps } from '@worldcoin/id'
import dynamic from "next/dynamic";
import Link from 'next/link';


interface Props {
    data: any[]
}

export default function Home({ data }: Props) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Traverse</title>
                <meta name="description" content="Smart contract security report generator" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title_recent}>
                    Generate Security Report
                </h1>

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
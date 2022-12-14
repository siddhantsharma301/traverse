import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { WidgetProps } from '@worldcoin/id'
import dynamic from "next/dynamic";
import Link from 'next/link';
import { useState } from "react"

const WorldIDWidget = dynamic<WidgetProps>(
    () => import('@worldcoin/id').then((mod) => mod.WorldIDWidget),
    { ssr: false }
)

interface Props {
    data: any[]
}


export default function Home({ data }: Props) {
    const [loading, setLoading] = useState(false);
    const load = async (response: any) => {
        setLoading(true)
    }

    return (
        (!loading) ? (
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
                    {
                        data.map((contract) => (
                            <Link href={`contracts/${contract.address}`} onClick={load} className={styles.card_recent} key={contract}>
                                <Image src={`/${contract.chain}.png`} alt="Heart Logo" width={30} height={30} />
                                <h2 className={styles.contract_name}>{contract.name}</h2>
                                <p>Address: {contract.address}</p>
                            </Link>
                        ))
                    }
                </div>
            </main>

            <footer className={styles.footer}>
                <Link
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Made with
                    <span className={styles.logo}>
                        <Image src="/heart.png" alt="Heart Logo" width={20} height={20} />
                    </span>
                    {' '}at ETHSF
                </Link>
            </footer>
        </div>) :
        (
            <div className={styles.container}>
            <Head>
                <title>Traverse</title>
                <meta name="description" content="Smart contract security report generator" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title_recent}>
                    Generating Security Report...
                </h1>
                <h4 className={styles.vote_title}>This may take upto 30 seconds...</h4>
            </main>

            <footer className={styles.footer}>
                <Link
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Made with
                    <span className={styles.logo}>
                        <Image src="/heart.png" alt="Heart Logo" width={20} height={20} />
                    </span>
                    {' '}at ETHSF
                </Link>
            </footer>
        </div>
        )
    )
}

export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(process.env.API_URL +`/top_contracts`)
    const data = await res.json()

    // Pass data to the page via props
    return { props: { data } }
}
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { WidgetProps } from '@worldcoin/id'
import dynamic from "next/dynamic";
import Link from 'next/link';


const WorldIDWidget = dynamic<WidgetProps>(
    () => import('@worldcoin/id').then((mod) => mod.WorldIDWidget),
    { ssr: false }
)

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
                    View Recent Contracts
                </h1>

                <div className={styles.grid}>
                    {
                        data.map((contract) => (
                            <Link href={`contracts/${contract.address}`} className={styles.card_recent}>
                                <Image src={`/${contract.chain}.png`} alt="Heart Logo" width={30} height={30} />
                                <h2 className={styles.contract_name}>{contract.name}</h2>
                                <p>Address: {contract.address}</p>
                            </Link>
                        ))
                    }
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

export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`http://localhost:3000/top_contracts`)
    const data = await res.json()
<<<<<<< HEAD

=======
>>>>>>> 4c014b7827f12e115a82053ed56f383fb0dcee7c

    // Pass data to the page via props
    return { props: { data } }
}
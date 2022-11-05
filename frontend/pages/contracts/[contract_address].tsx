import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { WidgetProps } from '@worldcoin/id'
import dynamic from "next/dynamic";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'


const WorldIDWidget = dynamic<WidgetProps>(
    () => import('@worldcoin/id').then((mod) => mod.WorldIDWidget),
    { ssr: false }
  )  

export default function Contracts() {
    const router = useRouter()
    const { contract_address } = router.query
    return (
        <div className={styles.container}>
        <Head>
          <title>Traverse</title>
          <meta name="description" content="Smart contract security report generator" />
          <link rel="icon" href="/favicon.png" />
        </Head>
  
        <main className={styles.main}>
          <h1 className={styles.title_recent}>
            Contract: {contract_address}
          </h1>
  
  
          <WorldIDWidget
            actionId="wid_staging_69e75b2d27bd76510d5752a719fde7e8" // obtain this from developer.worldcoin.org
            signal="my_signal"
            enableTelemetry
            onSuccess={(verificationResponse) => console.log(verificationResponse)}
            onError={(error) => console.error(error)}
            debug={true} // to aid with debugging, remove in production
          />
  
        </main>
        </div>
  
    )
}

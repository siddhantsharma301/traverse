import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from "react"
import { WidgetProps } from '@worldcoin/id'
import dynamic from "next/dynamic";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { Web3Storage } from "web3.storage";
import * as dotenv from "dotenv";

function createData(number: any, item: any, qty: any, price: any) {
    return { number, item, qty, price };
}

interface Props {
    upvotes: number,
    downvotes: number
}


const rows = [
    createData(1, "Apple", 5, 3),
    createData(2, "Orange", 2, 2),
    createData(3, "Grapes", 3, 1),
    createData(4, "Tomato", 2, 1.6),
    createData(5, "Mango", 1.5, 4)
];


const WorldIDWidget = dynamic<WidgetProps>(
    () => import('@worldcoin/id').then((mod) => mod.WorldIDWidget),
    { ssr: false }
)

export default function Contracts({stats}:{stats:any}) {
    const router = useRouter()
    const { contract_address } = router.query

    const [isHuman, setIsHuman] = useState(false)

    const proveHumanity = async (response: any) => {
        console.debug(response)
        setIsHuman(true)
    }



    return (
        <div className={styles.container}>
            <Head>
                <title>Traverse</title>
                <meta name="description" content="Smart contract security report generator" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title_recent}>
                    Security Report
                </h1>


                <WorldIDWidget
                    actionId="wid_staging_69e75b2d27bd76510d5752a719fde7e8" // obtain this from developer.worldcoin.org
                    signal="my_signal"
                    enableTelemetry
                    onSuccess={(response) => proveHumanity(response)}
                    onError={(error) => console.error(error)}
                    debug={false} // to aid with debugging, remove in production
                />

                <div className={styles.votes}>
                    <button className={styles.upvote} disabled={!isHuman}>{(isHuman) ? "Upvote" : "Verify with WorldID to Upvote"}</button>
                    <button className={styles.downvote} disabled={!isHuman}>{(isHuman) ? "Downvote" : "Verify with WorldID to Downvote"}</button>
                </div>

                <h3 className={styles.address}>Upvotes: {upvotes}</h3>
                <h3 className={styles.address}>Downvotes: {downvotes}</h3>

                {/* <TableContainer className={styles.table_container} component={Paper}>
                    <Table className={styles.table} aria-label="simple table">
                        <TableHead className={styles.table_head}>
                            <TableRow className={styles.table_row} >
                                <TableCell className={styles.table_cell}>S.No</TableCell>
                                <TableCell className={styles.table_cell} align="right">Item</TableCell>
                                <TableCell className={styles.table_cell} align="right">Quantity&nbsp;(kg)</TableCell>
                                <TableCell className={styles.table_cell} align="right">Price&nbsp;($)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow className={styles.table_row} key={row.number}>
                                    <TableCell className={styles.table_cell} component="th" scope="row">
                                        {row.number}
                                    </TableCell>
                                    <TableCell className={styles.table_cell} align="right">{row.item}</TableCell>
                                    <TableCell className={styles.table_cell} align="right">{row.qty}</TableCell>
                                    <TableCell className={styles.table_cell} align="right">{row.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}
                <TableContainer className={styles.table_container} component={Paper}>
                    <Table className={styles.table} aria-label="simple table">
                        <TableHead className={styles.table_head}>
                            <TableRow className={styles.table_row} >
                                <TableCell className={styles.table_cell}>Impact</TableCell>
                                <TableCell className={styles.table_cell} align="right">Confidence</TableCell>
                                <TableCell className={styles.table_cell} align="right">Description</TableCell>
                                <TableCell className={styles.table_cell} align="right">Check</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow className={styles.table_row} key={row.number}>
                                    <TableCell className={styles.table_cell} component="th" scope="row">
                                        {row.number}
                                    </TableCell>
                                    <TableCell className={styles.table_cell} align="right">{row.item}</TableCell>
                                    <TableCell className={styles.table_cell} align="right">{row.qty}</TableCell>
                                    <TableCell className={styles.table_cell} align="right">{row.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </main>
        </div>

    )
}

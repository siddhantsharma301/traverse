import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from "react"
import { WidgetProps } from '@worldcoin/id'
import dynamic from "next/dynamic";
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import MuiMarkdown from "mui-markdown";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tenderly from '../../components/Tenderly';

import { Web3Storage } from "web3.storage";
import * as dotenv from "dotenv";

function createData(number: any, item: any, qty: any, price: any) {
    return { number, item, qty, price };
}

const WorldIDWidget = dynamic<WidgetProps>(
    () => import('@worldcoin/id').then((mod) => mod.WorldIDWidget),
    { ssr: false }
)

export default function Contracts({ stats, upvotes, downvotes }: { stats: any, upvotes: number, downvotes: number }) {
    const router = useRouter()
    const { contract_address } = router.query

    const [isHuman, setIsHuman] = useState(false)
    const [upvotes_number, setUpvotes] = useState(upvotes)
    const [downvotes_number, setDownvotes] = useState(downvotes)


    const proveHumanity = async (response: any) => {
        console.debug(response)
        setIsHuman(true)
    }

    const upvoteIncrease = async (response: any) => {
        setUpvotes(upvotes_number + 1)
        const upvoteRes = await axios.post(`http://localhost:3000/upvote?contractAddr=${contract_address}`)
    }

    const downvoteIncrease = async (response: any) => {
        setDownvotes(downvotes_number - 1)
        const downvoteRes = await axios.post(`http://localhost:3000/downvote?contractAddr=${contract_address}`)
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
                <h3 className={styles.address}>Contract Address: {contract_address}</h3>


                <WorldIDWidget 
                    actionId="wid_staging_69e75b2d27bd76510d5752a719fde7e8" // obtain this from developer.worldcoin.org
                    signal="my_signal"
                    enableTelemetry
                    onSuccess={(response) => proveHumanity(response)}
                    onError={(error) => console.error(error)}
                    debug={false} // to aid with debugging, remove in production
                />

                <div className={styles.votes}>
                    <button className={styles.upvote} onClick={upvoteIncrease} disabled={!isHuman}>{(isHuman) ? "Upvote" : "Verify with WorldID to Upvote"}</button>
                    <button className={styles.downvote} onClick={downvoteIncrease} disabled={!isHuman}>{(isHuman) ? "Downvote" : "Verify with WorldID to Downvote"}</button>
                </div>

                <h4 className={styles.vote_title}>Upvotes: {upvotes_number}</h4>
                <h4 className={styles.vote_title}>Downvotes: {downvotes_number}</h4>

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
                                <TableCell className={styles.table_cell} align="center">Impact</TableCell>
                                <TableCell className={styles.table_cell} align="right">Confidence</TableCell>
                                <TableCell className={styles.table_cell} align="left">Description</TableCell>
                                <TableCell className={styles.table_cell} align="center">Check</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats.map((row: any) => (
                                <TableRow className={styles.table_row} key={row.counter}>
                                    <TableCell className={styles.table_cell} component="th" scope="row" align="center">
                                        {row.impact}
                                    </TableCell>
                                    <TableCell className={styles.table_cell} align="center">{row.confidence}</TableCell>
                                    <TableCell className={styles.table_cell} align="left"><MuiMarkdown>{row.description}</MuiMarkdown></TableCell>
                                    <TableCell className={styles.table_cell} align="center">{row.check}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* TODO: get chain ID of contract and all functions from abi */}
                <Tenderly address={contractAddress as string} chain_id={1} functions={[]}/>

            </main>
        </div>
    )
}

export const getServerSideProps = async (context: any) => {
    const { contract_address } = context.params;
    console.log("CONTRACT",contract_address)

    const upvoteRes = await axios.get(`http://localhost:3000/get_upvotes?contractAddr=${contract_address}`)

    const { upvotes } = await upvoteRes.data

    const downvoteRes = await axios.get(`http://localhost:3000/get_downvotes?contractAddr=${contract_address}`)

    const { downvotes } = await downvoteRes.data

    
    const scannerRes = await axios.get(`http://127.0.0.1:3000/test?contractAddr=${contract_address}`)
    // @ts-ignore
    const { cid } = await scannerRes.data
    // @ts-ignore
    const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
    const response = await client.get(cid);
    // @ts-ignore
    if (!response.ok) {
        throw new Error("Unable to fetch given CID");
    }
    // @ts-ignore
    const file = await response.files();
    const dataUnparsed = await file[0].text();
    const data = JSON.parse(dataUnparsed);
    const detections = data.results.detectors;

    const rows: any[] = [];
    var counter = 0;
    detections.forEach(async (detection: any) => {
        const obj = {
            counter: counter,
            description: detection.markdown,
            impact: detection.impact,
            confidence: detection.confidence,
            check: detection.check,
        }
        rows.push(obj);
        counter++;
    });

    return { props: { stats: rows, upvotes: upvotes, downvotes: downvotes } };
}

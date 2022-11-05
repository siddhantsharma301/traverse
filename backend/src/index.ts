import express from "express";
import { exec } from "child_process";
import util from "util";
import cors from "cors";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import * as dotenv from "dotenv";

dotenv.config();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
var contractAddrToCID = new Map<string, any>();

// @ts-ignore
const storageClient = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })

const app: express.Express = express();
app.use(cors());

app.get("/test", async (req: express.Request, res: express.Response) => {
  const contractAddr = req.query.contractAddr;
  console.log(contractAddrToCID);
  if (contractAddrToCID.has(contractAddr as string)) {
    const cid = contractAddrToCID.get(contractAddr as string);
    return res.status(200).json({ cid: cid });
  }
  try {
    exec(`slither ${contractAddr} --json ${contractAddr}.json`);
  } catch (error) {
    return res.status(500).json({ error: error })
  }

  await delay(5000);

  const file = await getFilesFromPath(`${contractAddr}.json`)
  const cid = await storageClient.put(file);
  contractAddrToCID.set(contractAddr as string, cid);
  return res.status(200).json({ cid: cid });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

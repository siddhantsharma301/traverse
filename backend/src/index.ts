import express from "express";
import { exec } from "child_process";
import cors from "cors";
import { Web3Storage, File, getFilesFromPath } from "web3.storage";
import * as dotenv from "dotenv";
import { DOMParser } from "@xmldom/xmldom";
import axios from "axios";
import xpath from "xpath";

dotenv.config();

var contractAddrToCID = new Map<string, any>();

// @ts-ignore
const storageClient = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });

const app: express.Express = express();
app.use(cors());

const get_contracts_from_scan = async (url: string) => {
  let chain = "";

  if (url == "https://etherscan.io/contractsVerified/1?ps=100") {
    chain = "Ethereum";
  } else if (url == "https://polygonscan.com/contractsVerified/1?ps=100") {
    chain = "Polygon";
  } else if (
    url == "https://optimistic.etherscan.io/contractsVerified/1?ps=100"
  ) {
    chain = "Optimistic";
  }

  let contract_list = [];

  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    },
  });
  const doc = new DOMParser().parseFromString(response.data);

  const numberOfPages = xpath
    .select('//*[@id="ctl00"]/div[3]/ul/li[3]/span/strong[2]/text()', doc)[0]
    .toString() as unknown as number;

  for (let i = 0; i < numberOfPages; i++) {
    const temp_url = url.replace(`${i}?ps=100`, `${i + 1}?ps=100`);
    const temp_response = await axios.get(temp_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
    });
    const doc = new DOMParser().parseFromString(temp_response.data);

    const contract_addresses = xpath
      .select('//*[@id="transfers"]/div[2]/table/tbody/tr/td[1]/a/text()', doc)
      .toString()
      .split(",");

    const contract_names = xpath
      .select('//*[@id="transfers"]/div[2]/table/tbody/tr/td[2]/text()', doc)
      .toString()
      .split(",");

    console.log(contract_names);

    console.log(contract_addresses.length);
    console.log(contract_names.length);

    for (let i = 0; i < contract_addresses.length; i++) {
      contract_list.push({
        chain: chain,
        address: contract_addresses[i],
        name: contract_names[i] || "Unknown",
      });
    }

    return contract_list;
  }
};

app.get("/test", async (req: express.Request, res: express.Response) => {
  const contractAddr = req.query.contractAddr;
  if (contractAddrToCID.has(contractAddr as string)) {
    const cid = contractAddrToCID.get(contractAddr as string);
    return res.status(200).json({ cid: cid });
  }
  try {
    exec(`slither ${contractAddr} --json ${contractAddr}.json`);
  } catch (error) {
    return res.status(500).json(error);
  }
  const file = await getFilesFromPath(`${contractAddr}.json`);
  const cid = await storageClient.put(file);
  contractAddrToCID.set(contractAddr as string, cid);
  return res.status(200).json({ cid: cid });
});

app.get(
  "/top_contracts",
  async (req: express.Request, res: express.Response) => {
    let contract_master_list: any[] = [];

    const eth_contract_list = await get_contracts_from_scan(
      "https://etherscan.io/contractsVerified/1?ps=100"
    );

    const polygon_contract_list = await get_contracts_from_scan(
      "https://polygonscan.com/contractsVerified/1?ps=100"
    );

    const optimistic_contract_list = await get_contracts_from_scan(
      "https://optimistic.etherscan.io/contractsVerified/1?ps=100"
    );

    contract_master_list = contract_master_list.concat(eth_contract_list);
    contract_master_list = contract_master_list.concat(polygon_contract_list);
    contract_master_list = contract_master_list.concat(
      optimistic_contract_list
    );

    return res.status(200).json(contract_master_list);
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

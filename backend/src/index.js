"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const cors_1 = __importDefault(require("cors"));
const web3_storage_1 = require("web3.storage");
const dotenv = __importStar(require("dotenv"));
const xmldom_1 = require("@xmldom/xmldom");
const axios_1 = __importDefault(require("axios"));
const xpath_1 = __importDefault(require("xpath"));
dotenv.config();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var contractAddrToCID = new Map();
var contractAddrToUpvotes = new Map();
var contractAddrToDownvotes = new Map();
// @ts-ignore
const storageClient = new web3_storage_1.Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(200).json({ message: "Hello World!" });
}));
const get_contracts_from_scan = (url) => __awaiter(void 0, void 0, void 0, function* () {
    let chain = "";
    if (url == "https://etherscan.io/contractsVerified/1?ps=100") {
        chain = "Ethereum";
    }
    else if (url == "https://polygonscan.com/contractsVerified/1?ps=100") {
        chain = "Polygon";
    }
    else if (url == "https://optimistic.etherscan.io/contractsVerified/1?ps=100") {
        chain = "Optimistic";
    }
    let contract_list = [];
    const response = yield axios_1.default.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        },
    });
    const doc = new xmldom_1.DOMParser().parseFromString(response.data);
    const numberOfPages = xpath_1.default
        .select('//*[@id="ctl00"]/div[3]/ul/li[3]/span/strong[2]/text()', doc)[0]
        .toString();
    for (let i = 0; i < numberOfPages; i++) {
        const temp_url = url.replace(`${i}?ps=100`, `${i + 1}?ps=100`);
        const temp_response = yield axios_1.default.get(temp_url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
            },
        });
        const doc = new xmldom_1.DOMParser().parseFromString(temp_response.data);
        const contract_addresses = xpath_1.default
            .select('//*[@id="transfers"]/div[2]/table/tbody/tr/td[1]/a/text()', doc)
            .toString()
            .split(",");
        const contract_names = xpath_1.default
            .select('//*[@id="transfers"]/div[2]/table/tbody/tr/td[2]/text()', doc)
            .toString()
            .split(",");
        for (let i = 0; i < contract_addresses.length; i++) {
            contract_list.push({
                chain: chain,
                address: contract_addresses[i],
                name: contract_names[i] || "Unknown",
            });
        }
        return contract_list;
    }
});
app.post("/upvote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractAddr = String(req.query.contractAddr);
    if (contractAddrToUpvotes.has(contractAddr)) {
        contractAddrToUpvotes.set(contractAddr, Number(contractAddrToUpvotes.get(contractAddr)) + 1);
    }
    else {
        contractAddrToUpvotes.set(contractAddr, 1);
    }
}));
app.post("/downvote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractAddr = String(req.query.contractAddr);
    if (contractAddrToDownvotes.has(contractAddr)) {
        contractAddrToDownvotes.set(contractAddr, Number(contractAddrToDownvotes.get(contractAddr)) - 1);
    }
    else {
        contractAddrToDownvotes.set(contractAddr, -1);
    }
}));
app.get("/get_upvotes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractAddr = req.query.contractAddr;
    if (contractAddrToUpvotes.has(contractAddr)) {
        return res
            .status(200)
            .json({ upvotes: contractAddrToUpvotes.get(contractAddr) });
    }
    else {
        return res.status(200).json({ upvotes: 0 });
    }
}));
app.get("/get_downvotes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractAddr = String(req.query.contractAddr);
    if (contractAddrToDownvotes.has(contractAddr)) {
        return res
            .status(200)
            .json({ downvotes: contractAddrToDownvotes.get(contractAddr) });
    }
    else {
        return res.status(200).json({ downvotes: 0 });
    }
}));
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractAddr = req.query.contractAddr;
    if (contractAddrToCID.has(contractAddr)) {
        const cid = contractAddrToCID.get(contractAddr);
        return res.status(200).json({ cid: cid });
    }
    try {
        (0, child_process_1.exec)(`slither ${contractAddr} --json ${contractAddr}.json`);
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
    yield delay(5000);
    const file = yield (0, web3_storage_1.getFilesFromPath)(`${contractAddr}.json`);
    const cid = yield storageClient.put(file);
    contractAddrToCID.set(contractAddr, cid);
    return res.status(200).json({ cid: cid });
}));
app.get("/top_contracts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let contract_master_list = [];
    const eth_contract_list = yield get_contracts_from_scan("https://etherscan.io/contractsVerified/1?ps=100");
    const polygon_contract_list = yield get_contracts_from_scan("https://polygonscan.com/contractsVerified/1?ps=100");
    const optimistic_contract_list = yield get_contracts_from_scan("https://optimistic.etherscan.io/contractsVerified/1?ps=100");
    contract_master_list = contract_master_list.concat(eth_contract_list);
    contract_master_list = contract_master_list.concat(polygon_contract_list);
    contract_master_list = contract_master_list.concat(optimistic_contract_list);
    shuffleArray(contract_master_list);
    return res.status(200).json(contract_master_list);
}));
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function processString(input) {
    let x = input.split("\\n");
    console.log(x);
    let y = "";
    for (let i = 0; i < x.length; i++) {
        if ((!(x[i].includes("pragma")) && !(x[i].includes("import"))) || i <= 1) {
            y = y.concat(x[i]);
        }
    }
    return y;
}
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

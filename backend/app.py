from dotenv import load_dotenv
from flask import Flask, request
import os
from lxml import etree
from bs4 import BeautifulSoup
import requests
import subprocess

# ETHERSCAN_API = "https://api.etherscan.io/api"
# POLYGONSCAN_API = "https://api.polygonscan.com/api"
# OPSCAN_API = "https://api-optimistic.etherscan.io/api"
# ETHERSCAN_KEY = os.environ["ETHERSCAN_KEY"]
# POLYGONSCAN_KEY = os.environ["POLYGONSCAN_KEY"]
# OPSCAN_KEY = os.environ["OPSCAN_KEY"]

# chain keys: eth, poly, opt

headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}

app = Flask(__name__)

# def get_source_code(contract_addr, url, api_key):
#     params = {
#         "module": "contract",
#         "action": "getsourcecode",
#         "address": contract_addr,
#         "apikey": api_key
#     }
#     res = requests.get(url, params)
#     return res["result"]["SourceCode"]

# def run_contract_test(contract_addr):
#     # url = ""
#     # api_key =""
#     # if chain == "eth":
#     #     url = ETHERSCAN_API
#     #     api_key = ETHERSCAN_KEY
#     # elif chain == "poly":
#     #     url = POLYGONSCAN_API
#     #     api_key = POLYGONSCAN_KEY
#     # elif chain == "opt":
#     #     url = OPSCAN_API
#     #     api_key = OPSCAN_KEY

#     # # get contract source code
#     # # source_code = get_source_code(contract_addr, url, api_key)
#     subprocess.run(["slither", contract_addr, f"--json {contract_addr}.json"],
#         capture_output=True
#     )

#     # run slither logic
#     # return test
#     # post some goofy ipfs shit

@app.route("/test", methods=["GET"])
def test():
    contract_addr = request.form.get("contract_addr")

    # check if contract on ether scan is multiple files

    # if not do this
    result = subprocess.run([f"slither {contract_addr} --json {contract_addr}.json"], shell=True)
    return {"file": f"{contract_addr}.json"}

    # if yes do this
    # 1. flatten to one file by removing imports and all pragma statements
    # 2. pass this file to slither

@app.route("/top_contracts", methods=["GET"])
def top_contracts():

    contracts_master_list = []

    ether_contracts = get_contracts_from_scan("https://etherscan.io/contractsVerified/1?ps=100")
    print("ether_contracts", len(ether_contracts))
    contracts_master_list.extend(ether_contracts)
    polygon_contracts = get_contracts_from_scan("https://polygonscan.com/contractsVerified/1?ps=100")
    print("polygon_contracts", len(polygon_contracts))
    contracts_master_list.extend(polygon_contracts)
    optimism_contracts = get_contracts_from_scan("https://optimistic.etherscan.io/contractsVerified/1?ps=100")
    print("optimism_contracts", len(optimism_contracts))
    contracts_master_list.extend(optimism_contracts)

    return {"contracts": contracts_master_list}

def get_contracts_from_scan(url):
    chain =""

    if "https://etherscan.io/contractsVerified/1?ps=100" in url:
        chain = "Ethereum"
    elif "https://polygonscan.com/contractsVerified/1?ps=100" in url:
        chain = "Polygon"
    elif "https://optimistic.etherscan.io/contractsVerified/1?ps=100" in url:
        chain = "Optomism"

    contract_list =[]
    r = requests.get(url,headers=headers)
    soup = BeautifulSoup(r.content, "html.parser")

    documentObjectModel = etree.HTML(str(soup)) 

    number_of_pages = documentObjectModel.xpath('//*[@id="ctl00"]/div[3]/ul/li[3]/span/strong[2]')[0].text

    for i in range(1, int(number_of_pages)+1):
        url = f"https://etherscan.io/contractsVerified/{i}?ps=100"
        r = requests.get(url,headers=headers)
        soup = BeautifulSoup(r.content, "html.parser")
        documentObjectModel = etree.HTML(str(soup)) 
        contract_address = documentObjectModel.xpath('//*[@id="transfers"]/div[2]/table/tbody/tr/td[1]/a')
        contract_name = documentObjectModel.xpath('//*[@id="transfers"]/div[2]/table/tbody/tr/td[2]')
        for i in range(len(contract_address)):
            contract_list.append({"contract_address": contract_address[i].text, "contract_name": contract_name[i].text, "chain": chain})
    return contract_list


if __name__ == "__main__":
    app.run(debug=True)
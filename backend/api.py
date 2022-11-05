from dotenv import load_dotenv
from flask import Flask
from flask_restful import Resource, Api, reqparse, abort, marshal, fields
import os
import requests

ETHERSCAN_API = "https://api.etherscan.io/api"
POLYGONSCAN_API = "https://api.polygonscan.com/api"
OPSCAN_API = "https://api-optimistic.etherscan.io/api"
ETHERSCAN_KEY = os.environ["ETHERSCAN_KEY"]
POLYGONSCAN_KEY = os.environ["POLYGONSCAN_KEY"]
OPSCAN_KEY = os.environ["OPSCAN_KEY"]

# chain keys: eth, poly, opt

app = Flask(__name__)
api = Api(app)


def get_source_code(contract_addr,url, api_key):
    params = {
        "module": "contract",
        "action": "getsourcecode",
        "address": contract_addr,
        "apikey": api_key
    }
    res = requests.get(url, params)
    return res["result"]["SourceCode"]

def run_contract_test(contract_addr, chain):
    url = ""
    api_key =""
    if chain == "eth":
        url = ETHERSCAN_API
        api_key = ETHERSCAN_KEY
    elif chain == "poly":
        url = POLYGONSCAN_API
        api_key = POLYGONSCAN_KEY
    elif chain == "opt":
        url = OPSCAN_API
        api_key = OPSCAN_KEY
    # get contract source code
    source_code = get_source_code(contract_addr, url, api_key)

    # run slither logic
    # return test
    # post some goofy ipfs shit

@app.route("/test", methods=["POST"])
def test():
    contract_addr = request.form.get("contract_addr")
    # check if addr valid/verified
    chain = request.form.get("chain")
    
    run_contract_test(contract_addr, chain)

    


@app.route("/eth-vc-source", methods=["GET"])
def eth_verified_source_code(contract_addr):
    params = {
        "module": "contract",
        "action": "getsourcecode",
        "address": contract_addr,
        "apikey": ETHERSCAN_KEY
    }
    res = requests.get(ETHERSCAN_API, params)
    return res["result"]["SourceCode"]

@app.route("/polygon-vc-source", methods=["GET"])
def polygon_verified_source_code(contract_addr):
    params = {
        "module": "contract",
        "action": "getsourcecode",
        "address": contract_addr,
        "apikey": POLYGONSCAN_KEY
    }
    res = requests.get(POLYGONSCAN_API, params)
    return res["result"]["SourceCode"]

@app.route("/op-vc-source", methods=["GET"])
def op_verified_source_code(contract_addr):
    params = {
        "module": "contract",
        "action": "getsourcecode",
        "address": contract_addr,
        "apikey": OPSCAN_KEY
    }
    res = requests.get(OPSCAN_API, params)
    return res["result"]["SourceCode"]
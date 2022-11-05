from dotenv import load_dotenv
from flask import Flask, request
import os
import requests
import subprocess

# ETHERSCAN_API = "https://api.etherscan.io/api"
# POLYGONSCAN_API = "https://api.polygonscan.com/api"
# OPSCAN_API = "https://api-optimistic.etherscan.io/api"
# ETHERSCAN_KEY = os.environ["ETHERSCAN_KEY"]
# POLYGONSCAN_KEY = os.environ["POLYGONSCAN_KEY"]
# OPSCAN_KEY = os.environ["OPSCAN_KEY"]

# chain keys: eth, poly, opt

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

    result = subprocess.run([f"slither {contract_addr} --json {contract_addr}.json"], shell=True)
    return {"file": f"{contract_addr}.json"}

if __name__ == "__main__":
    app.run(debug=True)
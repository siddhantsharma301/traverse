from dotenv import load_dotenv
from flask import Flask, request
import os
from lxml import etree
from bs4 import BeautifulSoup
import requests
import subprocess

headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}


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

    for i in range(0, int(number_of_pages)):
        url = url.replace(f"{i}?ps=100", f"{i+1}?ps=100")
        print(url)
        r = requests.get(url,headers=headers)
        soup = BeautifulSoup(r.content, "html.parser")
        documentObjectModel = etree.HTML(str(soup)) 
        contract_address = documentObjectModel.xpath('//*[@id="transfers"]/div[2]/table/tbody/tr/td[1]/a')
        contract_name = documentObjectModel.xpath('//*[@id="transfers"]/div[2]/table/tbody/tr/td[2]')
        for i in range(len(contract_address)):
            contract_list.append({"contract_address": contract_address[i].text, "contract_name": contract_name[i].text, "chain": chain})
    return contract_list

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


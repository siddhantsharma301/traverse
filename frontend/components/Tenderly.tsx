import React from "react";
import axios from "axios";
import { ethers } from "ethers";

export default function Tenderly({ address }: { address: string }) {
  const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

  const simulateTransactioon = () => {
    const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;

    const opts = {
      headers: {
        "X-Access-Key": TENDERLY_ACCESS_KEY as string,
      },
    };
    // TODO: Change this network_id and block_number to your own
    const body = {
      network_id: "1",
      block_number: 14386016,
    };

    axios
      .post(TENDERLY_FORK_API, body, opts)
      .then(async (res) => {
        console.log(
          `Forked with fork ID ${res.data.simulation_fork.id}. Check the Dashboard!`
        );
        const forkId = res.data.simulation_fork.id;
        const forkRPC = `https://rpc.tenderly.co/fork/${forkId}`;

        const provider = new ethers.providers.JsonRpcProvider(forkRPC);
        const signer = provider.getSigner();

        const params = [
          [0x874a90e8aece0f299498cfba9a9712ee311ccd04],
          ethers.utils.hexValue(100), // hex encoded wei amount
        ];

        await provider.send("tenderly_addBalance", params);

        // execute transaction

        const TENDERLY_FORK_ACCESS_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork/${forkId}`;

        await axios.delete(TENDERLY_FORK_ACCESS_URL, opts);
      })
      .catch((err) => console.error(err));
  };

  return <div>Tenderly</div>;
}

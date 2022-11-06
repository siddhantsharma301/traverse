import React from "react";

export default function Tenderly() {
  const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

  const SIMULATE_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`;

  const opts = {
    headers: {
      "X-Access-Key": TENDERLY_ACCESS_KEY as string,
    },
  };

  return <div>Tenderly</div>;
}

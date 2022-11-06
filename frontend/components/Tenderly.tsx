import axios from "axios";
import { useState } from "react";

export default function Tenderly({
  address,
  chain_id,
  functions,
}: {
  address: string;
  chain_id: number;
  functions: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [functionArgs, setFunctionArgs] = useState<any[]>([]);
  const [functionName, setFunctionName] = useState<string>("");
  const [functionArgsInputs, setFunctionArgsInputs] = useState<any[]>([]);
  const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

  const simulate = async () => {
    const dangerousEvents = ["Transfer", "Approval", "ApprovalForAll"];

    // const tenderlyBody = {
    //   network_id: parseInt(deserializedTx.chainId.toString(10)),
    //   from: deserializedTx.getSenderAddress().toString("hex"),
    //   to: deserializedTx.to.toString("hex"),
    //   input: deserializedTx.data.toString("hex"),
    //   gas: parseInt(deserializedTx.gasLimit.toString(10)),
    //   gas_price: deserializedTx.maxFeePerGas
    //     .add(deserializedTx.maxPriorityFeePerGas)
    //     .toString(10),
    //   value: parseInt(deserializedTx.value.toString(10)), // has a tendency to overflow so we use string
    // };

    const tenderlyUrl =
      "https://api.tenderly.co/api/v1/account/" +
      TENDERLY_USER +
      "/project/" +
      TENDERLY_PROJECT +
      "/simulate";
    // todo: replace w/ tenderly body
    const sim_req = await axios.post(
      tenderlyUrl,
      {},
      {
        headers: {
          "X-Access-Key": TENDERLY_ACCESS_KEY,
        },
      }
    );

    console.log(sim_req.data);

    const events =
      sim_req.data["transaction"]["transaction_info"]["call_trace"]["logs"];

    for (let i = 0; i < events.length; i++) {
      const element = events[i];
    }
  };

  return (
    <div>
      <h2>Simulate Functions</h2>
      <div
        className="flex relative justify-center p-2 button cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          console.log(isOpen);
        }}
      >
        <div className="flex justify-center items-center space-x-3 cursor-pointer">
          <div className="font-semibold text-lg">
            <div className="cursor-pointer">Functions </div>
          </div>
        </div>
        {isOpen && (
          <div className="absolute top-full w-full px-5 py-3 bg-white rounded border-2 border-black z-50 dark:bg-black dark:border-white">
            <ul className="space-y-2 text-white h-36 overflow-y-scroll">
              {functions.map((function_) => (
                <li
                  key={function_.name}
                  className="font-medium text-black cursor-pointer dark:text-white"
                  onClick={() => {
                    setFunctionArgs(function_.inputs as object[]);
                    setFunctionName(function_.name);
                    setIsOpen(false);
                    console.log(function_.inputs);
                  }}
                >
                  {function_.name == functionName ? (
                    <div className="font-medium text-black bg-green-300 dark:bg-green-800 rounded cursor-pointer p-2 dark:text-white">
                      {function_.name}
                    </div>
                  ) : (
                    <div className="font-medium text-black hover:bg-gray-200 rounded cursor-pointer p-2 dark:text-white dark:hover:bg-gray-800">
                      {function_.name}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {functionArgs && functionArgs.length > 0 && (
        <div>
          {functionArgs.map((arg) => (
            <div key={arg}>
              <div>{arg.name}</div>
              <input type="text"  />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

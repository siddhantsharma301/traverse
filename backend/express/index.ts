import express from "express";
import { exec } from "child_process";
import cors from "cors";

const app: express.Express = express();
app.use(cors());

app.get("/test", async (req: express.Request, res: express.Response) => {
  const contractAddr = req.query.contractAddr;
  exec(`slither ${contractAddr} --json ${contractAddr}.json`, (error) => {
    console.error(error)
    return res.status(500).json(error);
  });
  return res.status(200).json({ file: `${contractAddr}.json` });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

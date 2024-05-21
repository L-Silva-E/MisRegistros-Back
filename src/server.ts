import express from "express";

const app = express();
const PORT = 9000;

app.use(express.json());

app.get("/health", (_req, res) => {
  console.log("Health check");
  res.send({ status: "Ok!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

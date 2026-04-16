import express from "express";
import cors from "cors";
import countryRoutes from "./routes/countryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/countries", countryRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
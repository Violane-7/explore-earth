import fs from "fs";

// Read JSON file safely
const rawData = fs.readFileSync(
  new URL("../data/countries.json", import.meta.url)
);

const data = JSON.parse(rawData);

export const getCountry = (req, res) => {
  const code = req.params.code.toUpperCase();

  const country = data[code];

  if (!country) {
    return res.status(404).json({ message: "Country not found" });
  }

  res.json(country);
};
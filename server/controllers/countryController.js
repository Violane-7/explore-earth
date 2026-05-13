import fs from "fs";

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

  res.json({
    name: country.name,
    summary: country.summary ?? "A vibrant nation with deep heritage.",
    culture: country.culture ?? "Rich local customs, festivals, and traditions.",
    food: country.food ?? [],
    places: country.places ?? [],
    temperature: country.temperature ?? "Varies by region and season.",
  });
};

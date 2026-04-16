import data from "../data/countries.json" assert { type: "json" };

export const getCountry = (req, res) => {
  const code = req.params.code.toUpperCase();
  const country = data[code];

  if (!country) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(country);
};
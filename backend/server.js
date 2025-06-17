import express from "express";
import fetch from "node-fetch";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
const NASA_KEY = process.env.NASA_API_KEY;
if (!NASA_KEY) { console.error("Missing NASA_API_KEY!"); process.exit(1); }

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use("/api/", rateLimit({ windowMs: 60_000, max: 30 }));

app.get("/api/apod", async (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: "Missing date" });
  try {
    const nasaRes = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&date=${encodeURIComponent(date)}`
    );
    if (!nasaRes.ok) {
      const txt = await nasaRes.text();
      return res.status(nasaRes.status).json({ error: txt });
    }
    res.json(await nasaRes.json());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`API listening on port ${PORT}`));

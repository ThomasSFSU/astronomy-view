const MIN_APOD_DATE = new Date("1995-06-16");

async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    console.error("Missing NASA_API_KEY environment variable");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  let rawDate = Array.isArray(req.query?.date)
    ? req.query.date[0]
    : req.query?.date;

  if (!rawDate) {
    try {
      const url = new URL(
        req.url,
        `http://${req.headers.host || "localhost"}`
      );
      rawDate = url.searchParams.get("date");
    } catch (err) {
      console.error("Failed to parse request URL:", err);
    }
  }

  if (!rawDate) {
    return res.status(400).json({ error: "Missing required date parameter" });
  }

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return res
      .status(400)
      .json({ error: `Invalid date "${rawDate}". Expected YYYY-MM-DD.` });
  }

  if (parsedDate < MIN_APOD_DATE) {
    return res.status(400).json({
      error: "Date too early. APOD images start on 1995-06-16.",
    });
  }

  const isoDate = parsedDate.toISOString().split("T")[0];

  // Temporary short-circuit to verify serverless wiring without calling NASA.
  return res.status(200).json({
    message: "Serverless function reachable",
    receivedDate: isoDate,
    timestamp: new Date().toISOString(),
  });
}

module.exports = handler;

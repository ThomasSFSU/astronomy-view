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

  const endpoint = new URL("https://api.nasa.gov/planetary/apod");
  endpoint.searchParams.set("api_key", apiKey);
  endpoint.searchParams.set("date", isoDate);

  try {
    const response = await fetch(endpoint);
    const rawBody = await response.text();
    let payload = null;
    try {
      payload = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const message =
        payload?.error ||
        payload?.msg ||
        payload?.message ||
        "Unable to fetch APOD";
      return res.status(response.status).json({ error: message });
    }

    if (!payload || typeof payload !== "object") {
      return res
        .status(502)
        .json({ error: "Invalid response from NASA API" });
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=60"
    );
    return res.status(200).json(payload);
  } catch (error) {
    console.error("APOD fetch failed:", error);
    return res.status(500).json({ error: "Failed to reach NASA API" });
  }
}

module.exports = handler;

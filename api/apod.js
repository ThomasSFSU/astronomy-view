const MIN_APOD_DATE = new Date("1995-06-16");
const LOG_PREFIX = "[api/apod]";

const log = (...args) => console.log(LOG_PREFIX, ...args);

const sendJson = (res, status, payload) => {
  res.status(status).json(payload);
};

const buildMockResponse = isoDate => ({
  date: isoDate,
  explanation:
    "Mock APOD response served from the proxy. Set MOCK_APOD_RESPONSE=false to reach NASA.",
  hdurl: "https://via.placeholder.com/1500x900.png?text=Mock+APOD",
  media_type: "image",
  service_version: "v1",
  title: "Mock Astronomy Picture",
  url: "https://via.placeholder.com/1200x800.png?text=Mock+APOD",
  copyright: "Mock Data",
});

async function handler(req, res) {
  const start = Date.now();
  log("Incoming request", {
    method: req.method,
    query: req.query,
    url: req.url,
  });

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Method Not Allowed" });
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
      log("Failed parsing request URL", err);
    }
  }

  if (!rawDate) {
    return sendJson(res, 400, { error: "Missing required date parameter" });
  }

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return sendJson(res, 400, {
      error: `Invalid date "${rawDate}". Expected YYYY-MM-DD.`,
    });
  }

  if (parsedDate < MIN_APOD_DATE) {
    return sendJson(res, 400, {
      error: "Date too early. APOD images start on 1995-06-16.",
    });
  }

  const isoDate = parsedDate.toISOString().split("T")[0];
  log("Resolved date", { rawDate, isoDate });

  if (process.env.MOCK_APOD_RESPONSE === "true") {
    log("Serving mock response");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=30"
    );
    return sendJson(res, 200, buildMockResponse(isoDate));
  }

  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    log("Missing NASA_API_KEY");
    return sendJson(res, 500, { error: "Server misconfiguration" });
  }

  const endpoint = new URL("https://api.nasa.gov/planetary/apod");
  endpoint.searchParams.set("api_key", apiKey);
  endpoint.searchParams.set("date", isoDate);

  try {
    const nasaResponse = await fetch(endpoint.toString(), {
      headers: { "User-Agent": "astronomy-view-proxy/1.0" },
    });
    const rawBody = await nasaResponse.text();
    log("NASA response", {
      status: nasaResponse.status,
      ok: nasaResponse.ok,
      bytes: rawBody.length,
      durationMs: Date.now() - start,
    });

    let payload = null;
    try {
      payload = rawBody ? JSON.parse(rawBody) : null;
    } catch (err) {
      log("Failed to parse NASA JSON", err, rawBody.slice(0, 120));
    }

    if (!nasaResponse.ok) {
      const message =
        payload?.error ||
        payload?.msg ||
        payload?.message ||
        "Unable to fetch APOD";
      return sendJson(res, nasaResponse.status, { error: message });
    }

    if (!payload || typeof payload !== "object") {
      return sendJson(res, 502, { error: "Invalid response from NASA API" });
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=60"
    );
    return sendJson(res, 200, payload);
  } catch (error) {
    log("NASA request failed", error);
    return sendJson(res, 500, { error: "Failed to reach NASA API" });
  }
}

module.exports = handler;

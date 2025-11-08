// src/hooks/useApod.ts
import { useState, useEffect } from 'react';

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const APOD_API_URL = `${API_BASE}/api/apod`;

export interface ApodData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: "image" | "video";
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}



// Custom hook to fetch APOD data
export function useApod(date: Date, skip: boolean) {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, ApodData>>(() => {
    try { return JSON.parse(localStorage.getItem("apodCache") || "{}"); }
    catch { return {}; }
  });

  useEffect(() => {
    if (skip) return;
    const key = date.toISOString().split("T")[0];
    if (cache[key]) {
      setData(cache[key]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${APOD_API_URL}?date=${key}`)
      .then(res => {
        if (!res.ok) throw new Error(res.status === 404 ? "No image available for this date." : `Fetch error: ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (!json || typeof json.date !== "string" || !json.url) {
          throw new Error("Invalid API response");
        }
        setData(json);
        const updated = { ...cache, [key]: json };
        setCache(updated);
        localStorage.setItem("apodCache", JSON.stringify(updated));
      })
      .catch(err => {
        console.error("APOD fetch failed:", err);
        setData(null);
        setError(err instanceof Error ? err.message : "Unexpected error");
      })
      .finally(() => setLoading(false));
  }, [date, skip, cache]);

  return { data, loading, error } as const;
}

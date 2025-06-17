import { useEffect, useState, useMemo, useCallback, type JSX } from "react";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { Calendar } from "./components/ui/Calendar";
import Starfield from "./components/Starfield";

const APOD_API_URL = "api/apod";
const APOD_START_YEAR = 1995;

interface ApodData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: "image" | "video";
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

// Skeleton loader for APOD Card
function ApodSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-1/2 mx-auto"></div>
      <div className="h-64 bg-slate-800 rounded-xl"></div>
      <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6 mx-auto"></div>
    </div>
  );
}

// Custom hook to fetch APOD data
function useApod(date: Date, skip: boolean) {
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

export default function NasaSkyExplorer(): JSX.Element {
  const [date, setDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [favorites, setFavorites] = useState<ApodData[]>(() => {
    try { return JSON.parse(localStorage.getItem("favorites") || "[]"); }
    catch { return []; }
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const { data: apodData, loading, error } = useApod(date, showFavorites);

  // Memoized handlers
  const showToday = useCallback(() => {
    const now = new Date();
    setShowFavorites(false);
    setDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);

  const showRandom = useCallback(() => {
    setShowFavorites(false);
    const randomTime = Date.now() - Math.random() * (Date.now() - new Date(APOD_START_YEAR, 0, 1).getTime());
    setDate(new Date(randomTime));
  }, []);

  const saveToFavorites = useCallback(() => {
    if (!apodData) return;
    if (favorites.some(f => f.date === apodData.date)) {
      setConfirmation("Already in favorites");
    } else {
      const updated = [...favorites, apodData];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setConfirmation("Added to favorites!");
    }
    setTimeout(() => setConfirmation(null), 2000);
  }, [apodData, favorites]);

  const removeFavorite = useCallback((favDate: string) => {
    const updated = favorites.filter(f => f.date !== favDate);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setConfirmation("Removed from favorites");
    setTimeout(() => setConfirmation(null), 2000);
  }, [favorites]);

  const handleSelectFavorite = useCallback((fav: ApodData) => {
    setDate(new Date(fav.date));
    setShowFavorites(false);
  }, []);

  // Year & Month options
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const years = useMemo(
    () => Array.from({ length: currentYear - APOD_START_YEAR + 1 }, (_, i) => APOD_START_YEAR + i),
    [currentYear]
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Starfield />
      <main className="relative z-20 px-4 sm:px-6 py-8 font-sans">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-400 drop-shadow mb-10" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          Astronomy Viewer
        </h1>
        {confirmation && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-green-400 px-4 py-2 rounded shadow-lg z-50">{confirmation}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Viewer or Favorites */}
          <div className="lg:col-span-2 space-y-6">
            {showFavorites ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Your Favorites</h2>
                {favorites.length > 0 ? favorites.map(fav => (
                  <div key={fav.date} className="relative group">
                    <button onClick={() => handleSelectFavorite(fav)} className="w-full text-left">
                      <Card className="bg-slate-800 border-slate-600 rounded-xl shadow p-4 hover:border-blue-400">
                        <CardContent>
                          <div className="flex items-center gap-4">
                            <img src={fav.url} alt={fav.title} className="w-24 h-24 object-cover rounded" />
                            <div>
                              <h4 className="text-lg font-semibold">{fav.title}</h4>
                              <p className="text-sm text-gray-400">{fav.date}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </button>
                    <button onClick={e => { e.stopPropagation(); removeFavorite(fav.date); }} className="absolute top-2 right-2 text-red-400 hover:text-red-200">✕</button>
                  </div>
                )) : <p className="text-gray-400">No favorites saved yet.</p>}
              </div>
            ) : loading ? (
              <ApodSkeleton />
            ) : error ? (
              <p className="text-center text-red-400 font-semibold">{error}</p>
            ) : apodData ? (
              <Card className="bg-slate-900 border-slate-700 rounded-2xl shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-3xl font-bold text-blue-300">{apodData.title}</h2>
                  <p className="text-sm text-gray-400">{apodData.date}</p>
                  {apodData.media_type === "image" ? (
                    <img src={apodData.url} alt={apodData.title} className="rounded-xl w-full max-h-[400px] object-cover border border-slate-700 shadow" />
                  ) : (
                    <iframe src={apodData.url} title={apodData.title} className="w-full aspect-video rounded-xl border border-slate-700 shadow" allowFullScreen />
                  )}
                  <p className="text-gray-300">{apodData.explanation}</p>
                  <p className="text-right text-sm text-gray-500 italic">© {apodData.copyright || 'NASA'}</p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-center text-yellow-400">No image available for this date.</p>
            )}
          </div>

          {/* Right: Explore & Calendar */}
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl space-y-4">
              <h3 className="text-xl font-semibold">Explore</h3>
              <Button onClick={showToday} className="w-full py-1.5">Today</Button>
              <Button onClick={showRandom} className="w-full py-1.5">Random Date</Button>
              {!showFavorites && <Button onClick={saveToFavorites} className="w-full py-1.5">Save to Favorites</Button>}
              <Button onClick={() => setShowFavorites(s => !s)} className="w-full py-1.5">
                {showFavorites ? 'Back to Viewer' : 'View Favorites'}
              </Button>
            </div>

            {!showFavorites && (
              <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Pick a Date</h3>
                <div className="space-y-4">
                  <div className="flex justify-center items-center gap-2">
                    <select value={date.getFullYear()} onChange={e => setDate(prev => new Date(parseInt(e.target.value), prev.getMonth(), prev.getDate()))} className="bg-slate-700 text-white p-1 rounded">
                      {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                    </select>
                    <select value={date.getMonth()} onChange={e => setDate(prev => {
                      const m = parseInt(e.target.value);
                      const days = new Date(prev.getFullYear(), m+1, 0).getDate();
                      return new Date(prev.getFullYear(), m, Math.min(prev.getDate(), days));
                    })} className="bg-slate-700 text-white p-1 rounded">
                      {Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('default',{month:'long'})}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-center">
                    <Calendar selected={date} onSelect={setDate} disabled={{ before: new Date(APOD_START_YEAR,0,1), after: new Date() }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-xs text-gray-500 mt-12 px-4">
          Data provided by NASA's Astronomy Picture of the Day API — Built by{' '}
          <a href="https://www.thomasbrock.io" className="text-white">Thomas Brock</a>
        </footer>
      </main>
    </div>
  );
}

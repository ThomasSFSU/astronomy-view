import { useEffect, useState, type JSX } from "react";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { Calendar } from "./components/ui/Calendar";
import Starfield from "./components/Starfield";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

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

export default function NasaSkyExplorer(): JSX.Element {
  const [date, setDate] = useState<Date>(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); });
  const [apodData, setApodData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<ApodData[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, ApodData>>({});

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));

    const cached = localStorage.getItem("apodCache");
    if (cached) setCache(JSON.parse(cached));
  }, []);

  useEffect(() => {
    const fetchApod = async () => {
      const formattedDate = date.toISOString().split("T")[0];

      if (cache[formattedDate]) {
        setApodData(cache[formattedDate]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${formattedDate}`);
        if (!res.ok) {
          if (res.status === 404) {
            setApodData(null);
            setError("No image available for this date. Please try a different one.");
            setLoading(false);
            return;
          } else {
            throw new Error("Failed to fetch APOD data.");
          }
        }
        const data = await res.json();

        if (data.code === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }

        if (data.error) {
          throw new Error(data.error.message || "Unknown error occurred.");
        }

        setApodData(data);
        const updatedCache = { ...cache, [formattedDate]: data };
        setCache(updatedCache);
        localStorage.setItem("apodCache", JSON.stringify(updatedCache));
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Failed to fetch APOD data:", err);
          setApodData(null);
          setError(err.message || "An unexpected error occurred.");
        } else {
          console.error("Unknown error", err);
          setApodData(null);
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!showFavorites) fetchApod();
  }, [date, showFavorites]);

  const saveToFavorites = () => {
    if (!apodData) return;
    const alreadySaved = favorites.some(fav => fav.date === apodData.date);
    if (alreadySaved) {
      setConfirmation("Already in favorites");
    } else {
      const updated = [...favorites, apodData];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setConfirmation("Added to favorites!");
    }
    setTimeout(() => setConfirmation(null), 2000);
  };

  const removeFavorite = (favDate: string) => {
    const updated = favorites.filter(f => f.date !== favDate);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setConfirmation("Removed from favorites");
    setTimeout(() => setConfirmation(null), 2000);
  };

  const handleSelectFavorite = (fav: ApodData) => {
    setApodData(fav);
    setDate(new Date(fav.date));
    setShowFavorites(false);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Starfield />
      <main className="relative z-20 px-4 sm:px-6 py-8 font-sans transition-all duration-500 ease-in-out">
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-center text-blue-400 drop-shadow mb-10"
          style={{ fontFamily: "Space Grotesk, monospace" }}
        >
          🚀 NASA Sky Explorer
        </h1>

        {confirmation && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-800 text-green-400 rounded shadow-lg transition-opacity duration-300 z-50">
            {confirmation}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 transition-all duration-300">
            {showFavorites ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Your Favorites</h2>
                {favorites.length > 0 ? (
                  favorites.map((fav) => (
                    <div key={fav.date} className="relative group">
                      <button
                        className="w-full text-left"
                        onClick={() => handleSelectFavorite(fav)}
                      >
                        <Card className="bg-slate-800 border border-slate-600 rounded-xl shadow p-4 hover:border-blue-400">
                          <CardContent>
                            <div className="flex items-center gap-4">
                              <img src={fav.url} alt={fav.title} className="w-24 h-24 object-cover rounded" />
                              <div>
                                <h4 className="text-lg font-semibold text-white">{fav.title}</h4>
                                <p className="text-sm text-gray-400">{fav.date}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(fav.date);
                        }}
                        className="absolute top-2 right-2 text-sm text-red-400 hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No favorites saved yet.</p>
                )}
              </div>
            ) : loading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-1/2 mx-auto"></div>
                <div className="h-64 bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6 mx-auto"></div>
              </div>
            ) : error ? (
              <p className="text-center text-red-400 text-lg font-semibold">{error}</p>
            ) : apodData ? (
              <Card className="bg-slate-900 border border-slate-700 rounded-2xl shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h2 className="text-3xl font-bold mb-2 text-blue-300">{apodData.title}</h2>
                  <p className="text-sm text-gray-400 mb-4">{apodData.date}</p>
                  {apodData.media_type === "image" ? (
                    <img
                      src={apodData.url}
                      alt={apodData.title}
                      className="rounded-xl w-full max-h-[400px] object-cover border border-slate-700 shadow"
                    />
                  ) : (
                    <iframe
                      src={apodData.url}
                      title={apodData.title}
                      className="w-full aspect-video rounded-xl border border-slate-700 shadow"
                      allowFullScreen
                    />
                  )}
                  <p className="mt-6 text-base leading-relaxed text-gray-300">{apodData.explanation}</p>
                  <p className="mt-4 text-sm text-right text-gray-500 italic">© {apodData.copyright || "NASA"}</p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-center text-yellow-400 text-sm">
                No image available for this date. Please try a different one.
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl space-y-4">
              <h3 className="text-xl font-semibold text-white">Explore</h3>
              <Button onClick={() => { setShowFavorites(false); const now = new Date(); const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate()); setDate(todayLocal); }} className="w-full py-1.5 text-sm">
                Today
              </Button>
              <Button onClick={() => { setShowFavorites(false); setDate(new Date(new Date().getTime() - Math.random() * 1000 * 60 * 60 * 24 * 10000)); }} className="w-full py-1.5 text-sm">
                Random Date
              </Button>
              {!showFavorites && (
                <Button onClick={() => { setShowFavorites(false); saveToFavorites(); }} className="w-full py-1.5 text-sm">
                  Save to Favorites
                </Button>
              )}
              <Button onClick={() => setShowFavorites(!showFavorites)} className="w-full py-1.5 text-sm">
                {showFavorites ? "Back to Viewer" : "View Favorites"}
              </Button>
            </div>

            {!showFavorites && (
              <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Pick a Date</h3>
                <div className="flex justify-center">
                  <Calendar selected={date} onSelect={setDate} disabled={{ after: new Date() }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-xs text-gray-500 mt-12 px-4">
          Data provided by NASA's Astronomy Picture of the Day API — Built by <span className="text-white">Thomas Brock</span>
        </footer>
      </main>
    </div>
  );
}

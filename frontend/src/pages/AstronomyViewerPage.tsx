import { useState, useCallback, useMemo, type JSX } from 'react';
import { useApod, type ApodData } from '../hooks/useApod';
import { NasaSkyLayout } from '../components/layout/NasaSkyLayout';
import { ApodSkeleton } from '../components/ApodSkeleton';
import { ApodCard } from '../components/ApodCard';
import { FavoritesList } from '../components/FavoritesList';
import { ExplorePanel } from '../components/ExplorePanel';
import { DatePicker } from '../components/DatePicker';
import { ConfirmationToast } from '../components/ConfirmationToast';

const APOD_START_YEAR = 1995;

export default function AstronomyViewerPage(): JSX.Element {
  // Selected date
  const [date, setDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });

  // Favorites list
  const [favorites, setFavorites] = useState<ApodData[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });

  // Toggle between viewer and favorites
  const [showFavorites, setShowFavorites] = useState(false);

  // Confirmation message
  const [confirmation, setConfirmation] = useState<string | null>(null);

  // Fetch data for the current date unless viewing favorites
  const { data: apodData, loading, error } = useApod(date, showFavorites);

  // Handlers
  const showToday = useCallback(() => {
    const now = new Date();
    setShowFavorites(false);
    setDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);

  const showRandom = useCallback(() => {
    setShowFavorites(false);
    const randomTime =
      Date.now() - Math.random() * (Date.now() - new Date(APOD_START_YEAR, 0, 1).getTime());
    setDate(new Date(randomTime));
  }, []);

  const saveToFavorites = useCallback(() => {
    if (!apodData) return;
    if (favorites.some(f => f.date === apodData.date)) {
      setConfirmation('Already in favorites');
    } else {
      const updated = [...favorites, apodData];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setConfirmation('Added to favorites!');
    }
    setTimeout(() => setConfirmation(null), 2000);
  }, [apodData, favorites]);

  const removeFavorite = useCallback(
    (favDate: string) => {
      const updated = favorites.filter(f => f.date !== favDate);
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setConfirmation('Removed from favorites');
      setTimeout(() => setConfirmation(null), 2000);
    },
    [favorites]
  );

  const handleSelectFavorite = useCallback((fav: ApodData) => {
    setDate(new Date(fav.date));
    setShowFavorites(false);
  }, []);

  // Year options for the picker
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const years = useMemo(
    () => Array.from(
      { length: currentYear - APOD_START_YEAR + 1 },
      (_, i) => APOD_START_YEAR + i
    ),
    [currentYear]
  );

  return (
    <NasaSkyLayout>
      {/* Confirmation toast */}
      {confirmation && <ConfirmationToast message={confirmation} />}

      {/* Page title */}
      <h1
        className="text-4xl sm:text-5xl font-extrabold text-center text-blue-400 drop-shadow mb-10"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        Astronomy Viewer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: APOD viewer or favorites list */}
        <div className="lg:col-span-2 space-y-6">
          {showFavorites ? (
            <FavoritesList
              favorites={favorites}
              onSelect={handleSelectFavorite}
              onRemove={removeFavorite}
            />
          ) : loading ? (
            <ApodSkeleton />
          ) : error ? (
            <p className="text-center text-red-400 font-semibold">{error}</p>
          ) : apodData ? (
            <ApodCard data={apodData} />
          ) : (
            <p className="text-center text-yellow-400">
              No image available for this date.
            </p>
          )}
        </div>

        {/* Right: Controls */}
        <div className="space-y-6">
          <ExplorePanel
            showToday={showToday}
            showRandom={showRandom}
            saveToFavorites={saveToFavorites}
            toggleFavorites={() => setShowFavorites(s => !s)}
            isShowingFavorites={showFavorites}
          />

          {!showFavorites && (
            <DatePicker date={date} years={years} onChange={setDate} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-12 px-4">
        Data provided by NASA’s Astronomy Picture of the Day API — Built by{' '}
        <a href="https://www.thomasbrock.io" className="text-white">
          Thomas Brock
        </a>
      </footer>
    </NasaSkyLayout>
  );
}

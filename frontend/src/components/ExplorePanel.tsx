// src/components/ExplorePanel.tsx
import { Button } from './ui/Button';

interface Props {
  showRandom: () => void;
  showToday: () => void;
  saveToFavorites: () => void;
  toggleFavorites: () => void;
  isShowingFavorites: boolean;
}

export function ExplorePanel({
  showRandom,
  showToday,
  saveToFavorites,
  toggleFavorites,
  isShowingFavorites,
}: Props) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl space-y-4">
      <h3 className="text-xl font-semibold">Explore</h3>
      <Button onClick={showToday} className="w-full py-1.5">
        Today
      </Button>
      <Button onClick={showRandom} className="w-full py-1.5">
        Random Date
      </Button>
      {!isShowingFavorites && (
        <Button onClick={saveToFavorites} className="w-full py-1.5">
          Save to Favorites
        </Button>
      )}
      <Button onClick={toggleFavorites} className="w-full py-1.5">
        {isShowingFavorites ? 'Back to Viewer' : 'View Favorites'}
      </Button>
    </div>
  );
}

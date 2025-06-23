// src/components/FavoritesList.tsx
import type { ApodData } from '../hooks/useApod';
import { Card, CardContent } from './ui/Card';

interface Props {
  favorites: ApodData[];
  onSelect: (fav: ApodData) => void;
  onRemove: (date: string) => void;
}

export function FavoritesList({ favorites, onSelect, onRemove }: Props) {
  if (favorites.length === 0) {
    return <p className="text-gray-400">No favorites saved yet.</p>;
  }
  return (
    <div className="space-y-4">
      {favorites.map(fav => (
        <div key={fav.date} className="relative group">
          <button onClick={() => onSelect(fav)} className="w-full text-left">
            <Card className="bg-slate-800 border-slate-600 rounded-xl shadow p-4 hover:border-blue-400">
              <CardContent>
                <div className="flex items-center gap-4">
                  <img
                    src={fav.url}
                    alt={fav.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{fav.title}</h4>
                    <p className="text-sm text-gray-400">{fav.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onRemove(fav.date);
            }}
            className="absolute top-2 right-2 text-red-400 hover:text-red-200"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

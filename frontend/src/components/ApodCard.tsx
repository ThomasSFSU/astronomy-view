// src/components/ApodCard.tsx
import { Card, CardContent } from './ui/Card';
import type { ApodData } from '../hooks/useApod';

interface Props {
  data: ApodData;
}

export function ApodCard({ data }: Props) {
  return (
    <Card className="bg-slate-900 border-slate-700 rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-3xl font-bold text-blue-300">{data.title}</h2>
        <p className="text-sm text-gray-400">{data.date}</p>
        {data.media_type === 'image' ? (
          <img
            src={data.url}
            alt={data.title}
            className="rounded-xl w-full max-h-[400px] object-cover border border-slate-700 shadow"
          />
        ) : (
          <iframe
            src={data.url}
            title={data.title}
            className="w-full aspect-video rounded-xl border border-slate-700 shadow"
            allowFullScreen
          />
        )}
        <p className="text-gray-300">{data.explanation}</p>
        <p className="text-right text-sm text-gray-500 italic">
          © {data.copyright ?? 'NASA'}
        </p>
      </CardContent>
    </Card>
  );
}

// src/components/layout/NasaSkyLayout.tsx
import Starfield from '../ui/Starfield';

export function NasaSkyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Starfield />
      <main className="relative z-20 px-4 sm:px-6 py-8 font-sans">
        {children}
      </main>
    </div>
  );
}

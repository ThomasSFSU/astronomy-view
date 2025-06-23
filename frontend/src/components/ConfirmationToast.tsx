// src/components/ConfirmationToast.tsx
interface Props {
  message: string;
}

export function ConfirmationToast({ message }: Props) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-green-400 px-4 py-2 rounded shadow-lg z-50">
      {message}
    </div>
  );
}

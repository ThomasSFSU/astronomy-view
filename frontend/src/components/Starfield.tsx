export default function Starfield() {
  return (
    <>
      {/* Deep background (slowest, faintest) */}
      <div
        className="absolute inset-0 overflow-hidden animate-move-stars-slow z-0 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/stars.svg"
          alt=""
          className="w-full h-full opacity-5 object-cover scale-125"
        />
      </div>

      {/* Mid layer */}
      <div
        className="absolute inset-0 overflow-hidden animate-move-stars-slow z-10 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/stars.svg"
          alt=""
          className="w-full h-full opacity-10 object-cover scale-150"
        />
      </div>

      {/* Foreground (faster, brighter) */}
      <div
        className="absolute inset-0 overflow-hidden animate-move-stars-fast z-20 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/stars.svg"
          alt=""
          className="w-full h-full opacity-20 object-cover"
        />
      </div>
    </>
  );
}

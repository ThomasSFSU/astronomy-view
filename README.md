# NASA Sky Explorer

NASA Sky Explorer is a modern React + TypeScript web app that displays NASA's Astronomy Picture of the Day (APOD). It features a sleek animated starfield, date-based image browsing, offline caching, and favorites management — built with help from OpenAI's ChatGPT.

## Features

* Browse the Astronomy Picture of the Day
* Select dates with a custom calendar
* View today's or a random APOD
* Save favorite images to localStorage
* Animated starfield background
* Toast-style confirmations
* Offline cache to avoid repeated API requests
* Responsive layout and smooth transitions

## Technologies

* React + TypeScript
* Vite
* Tailwind CSS
* NASA APOD API
* react-day-picker

## Getting Started

1. Install dependencies using `npm install`
2. Create a `.env` file at the root with your NASA API key:
   `VITE_NASA_API_KEY=your_api_key_here`
3. Run the development server using `npm run dev`
4. Open `http://localhost:5173` in your browser

## Development Notes

This project was developed collaboratively using OpenAI's ChatGPT to:

* Implement localStorage and caching logic
* Add loading states, error handling, and confirmation toasts
* Resolve TypeScript types and edge cases
* Style components with Tailwind CSS
* Debug API time zone behavior and rate limits

## License

MIT © 2025 Thomas Brock

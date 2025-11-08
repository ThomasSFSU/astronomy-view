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

1. Install the frontend dependencies: `cd frontend && npm install`
2. Create a `.env` file in the repository root that contains your NASA key (used by the serverless API function):
   ```
   NASA_API_KEY=your_api_key_here
   ```
3. Install the Vercel CLI once (`npm install -g vercel`)
4. From the project root, run `vercel dev` to start the Vite dev server and the `/api/apod` serverless function
5. Open http://localhost:3000 to browse the app locally

## Development Notes

This project was developed collaboratively using OpenAI's ChatGPT to:

* Implement localStorage and caching logic
* Add loading states, error handling, and confirmation toasts
* Resolve TypeScript types and edge cases
* Style components with Tailwind CSS
* Debug API time zone behavior and rate limits

## Deploying to Vercel

The repository ships with `vercel.json`, an `/api/apod` serverless function, and a GitHub Actions workflow (`.github/workflows/deploy.yml`) that targets Vercel's free tier. To deploy:

1. Create a Vercel project that points to this repository.
2. Add these environment variables in the Vercel dashboard (Production + Preview):
   * `NASA_API_KEY` – your NASA APOD key
3. Store your Vercel credentials as GitHub secrets used by the workflow:
   * `VERCEL_TOKEN`
   * `VERCEL_ORG_ID`
   * `VERCEL_PROJECT_ID`
4. Push to `main` to trigger an automated production deployment, or run `vercel deploy` locally for previews.

`VITE_API_BASE_URL` is optional and only needed if you want the frontend to call a non-default API endpoint (for example, a self-hosted backend).

![Deploy to Vercel](https://github.com/<your-org>/<your-repo>/actions/workflows/deploy.yml/badge.svg)


## License

MIT © 2025 Thomas Brock

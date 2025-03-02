# Album Finder with Spotify API

A web application that lets users search for artists and albums using the Spotify API. Built with React, Vite, and styled-components.

## Features

- Search for artists and albums
- View detailed artist information including popularity metrics
- Browse albums and track listings
- Listen to track previews
- Responsive design for all devices

## Technologies Used

- React 18
- React Router v7
- Vite
- Styled Components
- React Bootstrap
- Recharts for visualizations
- Spotify Web API

## Deployment Steps

### 1. Set up Spotify API credentials

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new application to get your Client ID and Client Secret
3. Add your deployment URL to the Redirect URIs in your app settings

### 2. Set up GitHub repository secrets

In your GitHub repository:

1. Go to Settings > Secrets and variables > Actions
2. Add the following repository secrets:
   - `VITE_CLIENT_ID`: Your Spotify Client ID
   - `VITE_CLIENT_SECRET`: Your Spotify Client Secret

### 3. Deploy to GitHub Pages

1. Push your code to the main branch
2. GitHub Actions will automatically build and deploy your site
3. Check the Actions tab to monitor deployment progress
4. Once deployed, your site will be available at: https://[your-username].github.io/Album-Finder-with-Spotify-API/

## Local Development

1. Clone this repository
2. Create a `.env` file in the root directory with:
   ```
   VITE_CLIENT_ID=your_spotify_client_id
   VITE_CLIENT_SECRET=your_spotify_client_secret
   ```
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

## License

MIT

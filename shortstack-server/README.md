# Short Stack Server (shortstack.cc)

This is the main UI server for the Short Stack URL shortening service. It handles:
- Creating shortened URLs
- Displaying the URL shortener interface
- Providing statistics for shortened URLs

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

Or for development:
```bash
npm run dev
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `DB_PATH` - Path to SQLite database directory (default: ./data)

## Docker

Build:
```bash
docker build -t shortstack-server .
```

Run:
```bash
docker run -p 3000:3000 -v $(pwd)/data:/data shortstack-server
```

## Architecture

This server works in conjunction with the SOTK redirect server (sotk.cc):
- **Short Stack (shortstack.cc)**: Creates shortened URLs and displays the UI
- **SOTK (sotk.cc)**: Handles redirections and trusted domain management

Both servers share the same SQLite database for URL storage.

## Important Notes

- Shortened URLs are created with the format: `https://sotk.cc/{shortCode}`
- Users can manage trusted domains at `https://sotk.cc/manage-trusted`
- Trusted domains are stored in browser localStorage on the sotk.cc domain

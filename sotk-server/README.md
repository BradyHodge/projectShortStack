# SOTK Server (sotk.cc)

This is the redirect server for the Short Stack URL shortening service. It handles:
- URL redirections from shortened links
- Trusted domain verification
- Warning page for non-trusted domains
- Trusted domain management interface

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

- `PORT` - Server port (default: 3001)
- `DB_PATH` - Path to SQLite database directory (default: ./data)

## Docker

Build:
```bash
docker build -t sotk-server .
```

Run:
```bash
docker run -p 3001:3001 -v $(pwd)/data:/data sotk-server
```

## Routes

- `GET /` - Landing page that directs users to shortstack.cc
- `GET /manage-trusted` - Interface for managing trusted domains
- `GET /confirm` - Warning page for non-whitelisted domains
- `GET /:shortCode` - Smart redirect (checks whitelist, shows warning if needed)
- `GET /r/:shortCode` - Direct redirect (bypasses whitelist check)

## Architecture

This server works in conjunction with the Short Stack UI server (shortstack.cc):
- **Short Stack (shortstack.cc)**: Creates shortened URLs and displays the UI
- **SOTK (sotk.cc)**: Handles redirections and trusted domain management

Both servers share the same SQLite database for URL storage.

## Trusted Domains

- Server-side whitelist: Defined in `whitelistDomains.csv`
- User-managed trusted domains: Stored in browser localStorage
- Users can manage their personal trusted domains at `/manage-trusted`

## Important Notes

- Trusted domains stored in localStorage are specific to the sotk.cc domain
- The shortstack.cc site redirects to sotk.cc for trusted domain management
- Whitelisted domains skip the confirmation page automatically
- Users can add domains to their personal trust list from the confirmation page

# AGENTS.md

## Cursor Cloud specific instructions

This is a server-side-rendered React + Express demo of Adobe Target On Device
Decisioning. It is a single service; there is no separate frontend dev server,
database, or backend to run. There are no lint or automated test scripts.

### Node / OpenSSL gotcha (important)
The pinned toolchain node in this VM is Node 22 (`/exec-daemon/node`, always
first on `PATH`; `nvm` cannot override it). Webpack 5.16 fails on Node 17+ with
`ERR_OSSL_EVP_UNSUPPORTED`. Prefix every webpack build/dev command with
`NODE_OPTIONS=--openssl-legacy-provider`. The runtime server (`npm run start`,
plain `node ./server-build/index.js`) does NOT need the flag — only the webpack
build steps do.

### Build & run
Standard scripts live in `package.json`:
- Client bundle: `NODE_OPTIONS=--openssl-legacy-provider npm run build-dev`
- Server bundle: `NODE_OPTIONS=--openssl-legacy-provider npm run dev:build-server`
- Full dev (build client + build server + nodemon watch): `NODE_OPTIONS=--openssl-legacy-provider npm run dev`
- Run prebuilt server: `npm run start` (serves on port 3006)

The repo ships a prebuilt `server-build/index.js`, so `npm run start` works
without rebuilding. Rebuild the server bundle after editing `server/` or `src/`.

### Startup caveat
The Express app only calls `listen()` inside the Target SDK `clientReady` event,
which fires after the on-device decisioning artifact is fetched from
`assets.adobetarget.com`. So the server needs outbound network on first start,
and "Server is listening on port 3006" appears a few seconds after launch (after
"Target Artifact Downloaded!"), not immediately.

### Port
Port is `3006`, defined in `src/config/server.js` (overridable via `PORT` env
var). If you change it there, rebuild the server bundle for `npm run start`.

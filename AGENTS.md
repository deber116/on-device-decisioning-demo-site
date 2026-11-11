# AGENTS.md

## Overview

This is a server-side-rendered React + Express demo of Adobe Target On-Device
Decisioning. It is a single service; there is no separate frontend dev server,
database, or additional backend services to run. Perfect for demonstrating
Cursor Automations capabilities.

## Cursor Cloud specific instructions

### Environment setup
The repository includes `.cursor/environment.json` with:
- `npm ci` for dependency installation
- Egress allowlist for `assets.adobetarget.com` (required for Target SDK)
- `NODE_OPTIONS=--openssl-legacy-provider` set globally

### Node / OpenSSL gotcha (important)
The pinned toolchain node in this VM is Node 22 (`/exec-daemon/node`, always
first on `PATH`; `nvm` cannot override it). Webpack 5.16 fails on Node 17+ with
`ERR_OSSL_EVP_UNSUPPORTED`. 

**Solution**: Prefix every webpack build/dev command with
`NODE_OPTIONS=--openssl-legacy-provider`. The runtime server (`npm run start`,
plain `node ./server-build/index.js`) does NOT need the flag — only the webpack
build steps do.

The `.cursor/environment.json` sets this globally, so you typically don't need
to set it manually in Cloud Agent environments.

## Build, run, and test

### Quick start
```bash
# Install dependencies
npm ci

# Build everything
NODE_OPTIONS=--openssl-legacy-provider npm run build
NODE_OPTIONS=--openssl-legacy-provider npm run build-server

# Start the server
npm run start
```

### Available scripts
Standard scripts live in `package.json`:
- **Build client bundle**: `NODE_OPTIONS=--openssl-legacy-provider npm run build` (production) or `npm run build-dev` (development)
- **Build server bundle**: `NODE_OPTIONS=--openssl-legacy-provider npm run build-server` (production) or `npm run dev:build-server` (development)
- **Full dev mode** (build client + build server + nodemon watch): `NODE_OPTIONS=--openssl-legacy-provider npm run dev`
- **Run prebuilt server**: `npm run start` (serves on port 3006)
- **Run smoke test**: `npm run test` (requires built server bundle)
- **Run full CI suite**: `npm run ci` (builds everything and runs tests)

The repo ships a prebuilt `server-build/index.js`, so `npm run start` works
without rebuilding. Rebuild the server bundle after editing `server/` or `src/`.

### Testing

#### Automated tests
- **Smoke test**: `npm run test` - Verifies the server builds, starts correctly, and serves the homepage
- **Full CI**: `npm run ci` - Builds both client and server bundles, then runs the smoke test
- Tests require outbound network access to `assets.adobetarget.com`
- Smoke test includes 15-second startup timeout to allow for artifact download

#### Manual UI verification
For visual/UI changes:
1. Build and start the server: `npm run ci && npm run start`
2. Open http://localhost:3006 in a browser
3. Key pages to check:
   - **Homepage** (`/`): Hero carousel, product listings
   - **Products** (`/products`): Product grid
   - **Cart** (`/cart`): Shopping cart
   - **Wishlist** (`/wishlist`): Saved items

The homepage carousel and top banner are common targets for demo changes (e.g.,
adding a holiday banner or promotional message).

### Startup behavior
The Express app only calls `listen()` inside the Target SDK `clientReady` event,
which fires after the on-device decisioning artifact is fetched from
`assets.adobetarget.com`. 

**What this means**:
- The server needs outbound network access on first start
- "Server is listening on port 3006" appears a few seconds after launch
- You'll see "Target Artifact Downloaded!" just before the server starts
- In rare cases, if Adobe's artifact server is down or slow, startup may fail

### Port configuration
Port is `3006`, defined in `src/config/server.js` (overridable via `PORT` env
var). If you change it there, rebuild the server bundle for `npm run start`.

## CI/CD

### GitHub Actions
The repository includes `.github/workflows/ci.yml` that runs on:
- All pull requests targeting `main`
- All pushes to `main`

The workflow:
1. Sets up Node.js 22 (matching Cloud Agent environments)
2. Installs dependencies with `npm ci`
3. Builds client bundle with OpenSSL legacy provider flag
4. Builds server bundle with OpenSSL legacy provider flag
5. Runs the smoke test (starts server and verifies homepage)

### Typical CI run time
- Full build + test: ~2-3 minutes
- Most time is spent in dependency installation and webpack builds

## Demo scenarios

### Common PM-driven changes for live demos
When demonstrating Cursor Automations with a PM persona, typical changes include:

1. **Homepage banner/CTA changes**
   - Files: `src/components/home/Home.js`, `src/components/layout/Carousel.js`
   - Add promotional banners, seasonal messaging, CTAs

2. **Navigation updates**
   - File: `src/components/layout/Header.js`
   - Add new nav items, update menu structure

3. **Product display modifications**
   - Files: `src/components/products/Products.js`, `src/components/products/Product.js`
   - Change product card layout, add badges, modify pricing display

4. **Footer content**
   - File: `src/components/layout/Footer.js`
   - Update links, add social media, modify copy

### Verification after changes
1. Run `npm run ci` to verify builds and tests pass
2. Start the server with `npm run start`
3. Open http://localhost:3006 and visually verify the changes
4. Take screenshots/recordings for the PR
5. Open a PR - GitHub Actions will run automatically

## Known limitations and demo risks

### Critical: Adobe Target artifact dependency
- **Risk**: Server startup requires fetching artifact from `assets.adobetarget.com`
- **Mitigation**: Ensure outbound network access; `.cursor/environment.json` includes this domain in egress allowlist
- **If it fails**: Server will not start; very rare but possible if Adobe's CDN is down
- **Demo impact**: Medium - startup would fail, but can be retried

### GitHub Issues
- **Current state**: Unknown if Issues are enabled on this fork
- **Required for**: Issue-triggered automations
- **Action needed**: David must enable Issues in repo settings if not already enabled

### No linting
- **Current state**: No ESLint or Prettier configured
- **Impact**: Code style consistency not enforced
- **Demo impact**: Low - doesn't affect functionality

### Webpack deprecation warning
- **Current state**: Webpack 5.16 with Node 22 shows externals function deprecation
- **Impact**: Warning only, doesn't affect functionality
- **Demo impact**: None - warning is cosmetic

### Old dependencies
- **Current state**: React 16, old versions of various packages
- **Impact**: Functional but dated; works fine for demo purposes
- **Demo impact**: None - system is stable
- **Note**: Avoid broad dependency upgrades unless absolutely necessary to fix blocking issues

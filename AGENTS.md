# AGENTS.md

## Overview

This is a server-side-rendered React + Express demo storefront for demonstrating
Cursor Automations capabilities. It is a single service; there is no separate frontend dev server,
database, or additional backend services to run. Perfect for demonstrating
Cursor Automations capabilities in live presentations.

## Cursor Cloud specific instructions

### Environment setup
The repository includes `.cursor/environment.json` with:
- `npm ci --legacy-peer-deps` for dependency installation (required due to simpleform React 15 peer dependency)
- `NODE_OPTIONS=--openssl-legacy-provider` set globally for webpack builds

### Node / OpenSSL gotcha (important)
The pinned toolchain node in this VM is Node 22 (`/exec-daemon/node`, always
first on `PATH`; `nvm` cannot override it). Webpack 5.16 fails on Node 17+ with
`ERR_OSSL_EVP_UNSUPPORTED`. 

**Solution**: Prefix every webpack build/dev command with
`NODE_OPTIONS=--openssl-legacy-provider`. The runtime server (`npm run start`,
plain `node ./server-build/index.js`) does NOT need the flag — only the webpack
build steps do.

The `.cursor/environment.json` sets this globally, and the build scripts (`npm run build`, `npm run build-server`, `npm run ci`) also set it explicitly, so you typically don't need to set it manually.

## Build, run, and test

### Quick start
```bash
# Install dependencies
npm ci --legacy-peer-deps

# Build everything (build scripts set NODE_OPTIONS automatically)
npm run build
npm run build-server

# Or use the CI script to build and test everything
npm run ci

# Start the server
npm run start
```

### Available scripts
Standard scripts live in `package.json`:
- **Build client bundle**: `npm run build` (production, sets NODE_OPTIONS automatically) or `npm run build-dev` (development)
- **Build server bundle**: `npm run build-server` (production, sets NODE_OPTIONS automatically) or `npm run dev:build-server` (development)
- **Full dev mode** (build client + build server + nodemon watch): `NODE_OPTIONS=--openssl-legacy-provider npm run dev`
- **Run prebuilt server**: `npm run start` (serves on port 3006)
- **Run smoke test**: `npm run test` (requires built server bundle)
- **Run full CI suite**: `npm run ci` (builds everything and runs tests, sets NODE_OPTIONS automatically)

The repo ships a prebuilt `server-build/index.js`, so `npm run start` works
without rebuilding. Rebuild the server bundle after editing `server/` or `src/`.

### Testing

#### Automated tests
- **Smoke test**: `npm run test` - Verifies the server builds, starts correctly, and serves the homepage
- **Full CI**: `npm run ci` - Builds both client and server bundles, then runs the smoke test
- Smoke test includes 30-second startup timeout

#### Manual UI verification
For visual/UI changes:
1. Build and start the server: `npm run ci && npm run start`
2. Open http://localhost:3006 in a browser
3. Key pages to check:
   - **Homepage** (`/`): Hero carousel, product listings
   - **Products** (`/products`): Product grid
   - **Cart** (`/cart`): Shopping cart
   - **Wishlist** (`/wishlist`): Saved items

The homepage carousel and top area are common targets for demo changes (e.g.,
adding a promotional banner or seasonal message).

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
2. Installs dependencies with `npm ci --legacy-peer-deps`
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
   - File: `src/containers/NavBar.jsx`
   - Add new nav items, update menu structure

3. **Product display modifications**
   - Files: `src/components/products/Products.js`, `src/components/products/Product.js`
   - Change product card layout, add badges, modify pricing display

4. **Footer content**
   - File: `src/components/Footer.jsx`
   - Update links, add social media, modify copy

### Verification after changes
1. Run `npm run ci` to verify builds and tests pass
2. Start the server with `npm run start`
3. Open http://localhost:3006 and visually verify the changes
4. Take screenshots/recordings for the PR
5. Open a PR - GitHub Actions will run automatically

## Known limitations and demo risks

### No linting
- **Current state**: No ESLint or Prettier configured
- **Impact**: Code style consistency not enforced
- **Demo impact**: Low - doesn't affect functionality

### Webpack deprecation warning
- **Current state**: Webpack 5.16 with Node 22 shows externals function deprecation
- **Impact**: Warning only, doesn't affect functionality
- **Demo impact**: None - warning is cosmetic

### Old dependencies
- **Current state**: React 16, old versions of various packages; simpleform@0.1.3 has React 15 peer dependency
- **Impact**: Functional but dated; works fine for demo purposes; requires `--legacy-peer-deps` for fresh installs
- **Demo impact**: None - system is stable and GitHub Actions CI handles this automatically
- **Note**: Avoid broad dependency upgrades unless absolutely necessary to fix blocking issues

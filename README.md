# Product Shop Demo Site

A server-side-rendered React + Express demo storefront for demonstrating Cursor Automations capabilities during presentations.

## Installation

* Download/Clone this repo.
* Run `npm ci --legacy-peer-deps` on the terminal to install all the dependencies.
* The Application will be running in port 3006, if you wish to change the port, you must change it in `src/config/server.js`
* If you change the port, ensure you build again by executing `npm run build-server`
* Run `npm run start` on the terminal to start the application.
* Open http://localhost:3006/ to see the demo site.

## Build & Test

```bash
# Install dependencies
npm ci --legacy-peer-deps

# Build everything and run tests
npm run ci

# Start the server
npm run start
```

## Customization

* Ensure you have stopped the server by terminating the process running in the terminal. (Closing the terminal will not end the server process)
* You can modify the React components in `src/` to change the UI
* Common files for demo changes:
  - Homepage banners/CTAs: `src/components/home/Home.js`, `src/components/layout/Carousel.js`
  - Navigation: `src/containers/NavBar.jsx`
  - Product display: `src/components/products/Products.js`, `src/components/products/Product.js`
  - Footer: `src/components/Footer.jsx`

## Architecture

* This demo site uses server-side rendering with React and Express
* The server code is in `server/index.js`
* React Context API is used to pass data to all components
* The site includes a shopping cart, wishlist, and product catalog

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the MIT License. See [LICENSE](./LICENSE.md) for more information.

Original source code copyright 2020 Adobe. See LICENSE.md for full copyright and permission notice.

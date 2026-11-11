/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import path from 'path';
import fs from 'fs';

import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';

import App from '../src/containers/App';
import store from '../src/store';
import TargetContext from '../src/contexts/TargetContext';
import { SERVER_PORT } from '../src/config/server'
import { Provider } from 'react-redux';
import { StaticRouter } from "react-router";

const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || SERVER_PORT;
const app = express();

// Removed Target SDK dependency - app now starts immediately without external dependencies

app.use(cookieParser());

app.use('/assets', express.static(path.resolve('./public/assets')));
app.use('/product/assets', express.static(path.resolve('./public/assets')));

/**
 * Starts the Express application
 * 
 * Main application entry point that handles all routes and renders React components.
 */
function startApp() {
  app.get('/*', (req, res) => {

    // Empty attributes object - personalization features removed
    const targetAttributes = {
      featureflags: {},
      attributes: {},
      rollouts: {}
    };

    const context = {};
    const renderedApp = ReactDOMServer.renderToString(
      <Provider store={store}>
        <TargetContext.Provider value={targetAttributes} >
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </TargetContext.Provider>
      </Provider>);

    let preloadedState = store.getState();
    const indexFile = path.resolve('./public/index.html');

    fs.readFile(indexFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Something went wrong:', err);
        return res.status(500).send('Oops, better luck next time!');
      }

      return res.send(
        data.replace('<div id="app"></div>', `
          <div class="server" id="app">${renderedApp}</div>
          <script>
              window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
          /</g,
          '\\u003c'
        )}
              
              window.__PRELOADED_TARGET_ATTR__ = ${JSON.stringify(targetAttributes).replace(
          /</g,
          '\\u003c'
        )}
    
            </script>
          `)
      );
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

}

// Start app immediately without waiting for external dependencies
startApp();


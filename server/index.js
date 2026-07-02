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
import { targetClientCode, imsOrg } from '../src/config/target'
import { SERVER_PORT } from '../src/config/server'
import { Provider } from 'react-redux';
import { StaticRouter } from "react-router";

const cookieParser = require("cookie-parser");
const TargetClient = require("@adobe/target-nodejs-sdk");

const PORT = process.env.PORT || SERVER_PORT;
const app = express();

/**
 * Adobe Target SDK Configuration
 * 
 * Configures the Adobe Target Node.js SDK for on-device decisioning.
 * This configuration enables server-side personalization and A/B testing.
 * 
 * @type {Object}
 * @property {string} client - Target client code from configuration
 * @property {string} organizationId - Adobe IMS organization ID
 * @property {string} decisioningMethod - Decisioning method ("on-device" for local decisioning)
 * @property {Object} events - Event handlers for Target SDK lifecycle
 * @property {Function} events.clientReady - Called when Target client is ready
 * @property {Function} events.artifactDownloadSucceeded - Called when artifact download succeeds
 * @property {Function} events.artifactDownloadFailed - Called when artifact download fails
 */
const CONFIG = {
  client: targetClientCode,
  organizationId: imsOrg,
  decisioningMethod: "on-device",
  events: {
    clientReady: startApp,
    artifactDownloadSucceeded: onArtifactDownloadSucceeded,
    artifactDownloadFailed: onArtifactDownloadFailed
  },
};

/**
 * Adobe Target Client Instance
 * 
 * Creates and initializes the Adobe Target Node.js SDK client.
 * This client handles on-device decisioning and personalization.
 * 
 * @type {Object} Target client instance
 */
const targetClient = TargetClient.create(CONFIG);

app.use(cookieParser());

app.use('/assets', express.static(path.resolve('./public/assets')));
app.use('/product/assets', express.static(path.resolve('./public/assets')));

/**
 * Handles successful Target artifact download
 * 
 * Called when the Target decisioning artifact is successfully downloaded.
 * Saves the artifact to a local JSON file for offline use.
 * 
 * @param {Object} event - Artifact download success event
 * @param {string} event.artifactLocation - Location of the downloaded artifact
 * @param {Object} event.artifactPayload - The artifact payload data
 */
function onArtifactDownloadSucceeded(event) {
  console.log('Target Artifact Downloaded!', event.artifactLocation);
  // You can also write the artifact to a local file for using it in 
  fs.writeFile('src/config/target-rules.json', JSON.stringify(event.artifactPayload), 'utf8', (err) => {
    if (err) {
      throw err
    };
  });
}

/**
 * Handles failed Target artifact download
 * 
 * Called when the Target decisioning artifact download fails.
 * Logs the error for debugging purposes.
 * 
 * @param {Object} event - Artifact download failure event
 * @param {string} event.artifactLocation - Location where the artifact was attempted to be downloaded
 * @param {Error} event.error - Error object containing failure details
 */
function onArtifactDownloadFailed(event) {
  console.log(`The local decisioning artifact failed to download from '${event.artifactLocation}' with the following error message: ${event.error.message}`);
}

/**
 * Starts the Express application after Target client is ready
 * 
 * Main application entry point that handles all routes and Target personalization.
 * Processes Target attributes and renders React components with personalized content.
 */
function startApp() {
  app.get('/*', (req, res) => {

    let targetAttributes = {}, targetCookie = "";
    const u = req.url;
    const firstPath = u.substring(1, u.indexOf("/", 2) == -1 ? u.length : u.indexOf("/", 2));
    const viewName = firstPath == "" ? "home" : firstPath;

    targetCookie = req.cookies[TargetClient.TargetCookieName];

    targetClient.getAttributes([viewName + "-ondevice-featureflag", viewName + "-ondevice-attributes", viewName + "-ondevice-rollouts"], { targetCookie }).then(function (response) {

      let resTargetCookie = response.getResponse().targetCookie;

      if (resTargetCookie) {
        res.cookie(resTargetCookie.name, resTargetCookie.value, { maxAge: resTargetCookie.maxAge * 1000 });
      }

      targetAttributes.featureflags = response.asObject(viewName + "-ondevice-featureflag");
      targetAttributes.attributes = response.asObject(viewName + "-ondevice-attributes");
      targetAttributes.rollouts = response.asObject(viewName + "-ondevice-rollouts");

      const context = {};
      const app = ReactDOMServer.renderToString(
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
          <div class="server" id="app">${app}</div>
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
  });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

}


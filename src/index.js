/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App'
import TargetContext from './contexts/TargetContext';
import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter } from 'react-router-dom'

/**
 * Adobe Target Client-Side Application Initialization
 * 
 * Global application object that initializes the React app with Target personalization data.
 * This object is called from the server-side rendered HTML to hydrate the client-side React app.
 */

/**
 * Global ASHOP_APP object for client-side initialization
 * 
 * @namespace ASHOP_APP
 * @property {Function} initialize - Initializes the React app with Target attributes
 * @param {Object} targetAttributes - Target personalization data from server
 * @param {Object} targetAttributes.featureflags - Target feature flags and experiments
 * @param {Object} targetAttributes.attributes - Target personalization attributes
 * @param {Object} targetAttributes.offers - Target content offers
 */
window['ASHOP_APP'] = window['ASHOP_APP'] || (() => {
  return {
    /**
     * Initializes the React application with Target personalization data
     * 
     * Renders the React app with Redux store, Target context, and routing.
     * This method is called from the server-side rendered HTML to hydrate the client.
     * 
     * @param {Object} targetAttributes - Target personalization data from server
     */
    initialize: (targetAttributes) => {
      ReactDOM.render(
        <Provider store={store}>
          <TargetContext.Provider value={targetAttributes} >
            <BrowserRouter forceRefresh={true}>
              <App />
            </BrowserRouter>
          </TargetContext.Provider>
        </Provider>,
        document.getElementById('app')
      );
    }
  };
})();

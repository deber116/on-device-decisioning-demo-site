/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';

/**
 * Adobe Target Context
 * 
 * React Context for sharing Adobe Target personalization data across components.
 * Provides access to Target offers, feature flags, and attributes throughout the application.
 * 
 * @type {React.Context}
 * @property {Object} value - Target context value containing personalization data
 * @property {Object} value.featureflags - Target feature flags and experiments
 * @property {Object} value.attributes - Target personalization attributes
 * @property {Object} value.offers - Target content offers
 */
const TargetContext = React.createContext({});

export default TargetContext;
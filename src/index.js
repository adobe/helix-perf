/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const { wrap } = require('@adobe/helix-status');
const { logger } = require('@adobe/openwhisk-action-utils');
const perf = require('./perf.js');

/**
 * Runs the action by wrapping the `perf` function with the pingdom-status utility.
 * Additionally, if a EPSAGON_TOKEN is configured, the epsagon tracers are instrumented.
 * @param params Action params
 * @returns {Promise<*>} The response
 */
async function run(params) {
  const { __ow_logger: log } = params;
  let action = perf;
  if (params && params.EPSAGON_TOKEN) {
    // ensure that epsagon is only required, if a token is present. this is to avoid invoking their
    // patchers otherwise.
    // eslint-disable-next-line global-require
    const { openWhiskWrapper } = require('epsagon');
    log.info('instrumenting epsagon.');
    action = openWhiskWrapper(action, {
      token_param: 'EPSAGON_TOKEN',
      appName: 'Helix Services',
      metadataOnly: false, // Optional, send more trace data,
      ignoredKeys: [/[A-Z0-9_]+/],
    });
  }
  return wrap(action, { calibre: 'https://calibreapp.com/graphql' })(params);
}

/**
 * Main function called by the openwhisk invoker.
 * @param params Action params
 * @returns {Promise<*>} The response
 */
async function main(params) {
  return logger.wrap(run, params);
}

module.exports.main = main;

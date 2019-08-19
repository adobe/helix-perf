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
const { wrap } = require('@adobe/helix-pingdom-status');
const { logger: createLogger } = require('@adobe/openwhisk-action-utils');
const perf = require('./perf.js');

let log;

/**
 * Runs the action by wrapping the `perf` function with the pingdom-status utility.
 * Additionally, if a EPSAGON_TOKEN is configured, the epsagon tracers are instrumented.
 * @param params Action params
 * @returns {Promise<*>} The response
 */
async function run(params) {
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
      metadataOnly: false, // Optional, send more trace data
    });
  }
  return wrap(action, { calibre: 'https://calibreapp.com/graphql' })(params);
}

/**
 * Main function called by the openwhisk invoker.
 * @param params Action params
 * @param logger The logger.
 * @returns {Promise<*>} The response
 */
async function main(params, logger = log) {
  try {
    log = createLogger(params, logger);
    const result = await run(params);
    if (log.flush) {
      log.flush(); // don't wait
    }
    return result;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      statusCode: e.statusCode || 500,
    };
  }
}

module.exports.main = main;

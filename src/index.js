/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const URI = require('uri-js');
const fastly = require('@adobe/fastly-native-promises');

function init(token) {
  process.env.CALIBRE_API_TOKEN = token;
  let calibre;
  return () => {
    if (calibre) {
      return calibre;
    }
    // calibre loads the environment variables at require-time
    // so we delay loading until called.
    /* eslint-disable global-require */
    calibre = require('calibre');
    return calibre;
  };
}

function test(calibre, {
  url, location, device, connection, strain,
}) {
  return calibre.Test.create({
    url,
    location,
    device,
    connection,
    cookies: [
      {
        name: 'X-Strain',
        value: strain,
        secure: true,
        httpOnly: true,
        domain: URI.parse(url).host,
      },
    ],
  }).then(async ({ uuid }) => uuid);
}

async function result(calibre, uuid) {
  const nothing = new Promise(((resolve) => {
    // maximum response time for OpenWhisk is 60 seconds,
    // so let's wait no longer than 45 seconds.
    setTimeout(resolve, 1000 * 45, uuid);
  }));

  const testresult = calibre.Test.waitForTest(uuid);

  const res = await Promise.race([nothing, testresult]);
  if (typeof res === 'string') {
    return uuid;
  }
  return res;
}

module.exports = async function main({
  CALIBRE_AUTH,
  service,
  token,
  tests = [],
  // eslint-disable-next-line camelcase
  __ow_method = 'get',
}) {
  const start = Date.now();
  const getcalibre = init(CALIBRE_AUTH);

  // eslint-disable-next-line camelcase
  if (__ow_method === 'get' && tests.length > 0) {
    return fastly(token, service).readVersions()
      .then(() => Promise.all(tests.map(uuid => result(getcalibre(), uuid))).catch(e => ({
        statusCode: 500,
        body: 'Unable to retrieve test results',
        error: e,
      })))
      .catch(() => ({
        statusCode: 401,
        body: 'Invalid credentials.',
      }));
    // eslint-disable-next-line camelcase
  } if (__ow_method === 'get') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: `<pingdom_http_custom_check>
  <status>OK</status>
  <response_time>${Math.abs(Date.now() - start)}</response_time>
</pingdom_http_custom_check>`,
    };
  }
  return fastly(token, service).readVersions()
    .then(() => Promise.all(tests.map(spec => test(getcalibre(), spec))).catch(() => ({
      statusCode: 500,
      body: 'Unable to perfom test',
    })))
    .catch(() => ({
      statusCode: 401,
      body: 'Invalid credentials.',
    }));
};

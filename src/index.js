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
  }).then(async ({ uuid }) => {
    const result = await calibre.Test.waitForTest(uuid);
    return {
      test: {
        url, location, device, connection, strain,
      },
      uuid,
      result,
    };
  });
}

module.exports = async function main({
  CALIBRE_AUTH,
  service,
  token,
  tests = [],
}) {
  const getcalibre = init(CALIBRE_AUTH);
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

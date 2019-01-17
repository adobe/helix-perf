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
    cookies: [{
      name: 'X-Strain',
      value: strain,
      secure: true,
      httpOnly: true,
    }],
  }).then(({ uuid }) => calibre.Test.waitForTest(uuid));
}

module.exports = async function main({
  CALIBRE_AUTH,
  tests = [],
}) {
  const getcalibre = init(CALIBRE_AUTH);
  return Promise.all(tests.map(spec => test(getcalibre(), spec)));
};

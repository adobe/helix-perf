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

const main = require('./src/index');

module.exports.main = (params) => {
  const start = Date.now();
  // eslint-disable-next-line no-underscore-dangle
  if (params && params.__ow_method && params.__ow_method === 'get') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: `<pingdom_http_custom_check>
        <status>OK</status>
        <response_time>${Math.abs(Date.now() - start) / 1000}</response_time>
    </pingdom_http_custom_check>`,
    };
  }
  return main(params);
};

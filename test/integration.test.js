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

/* eslint-env mocha */

const assert = require('assert');
const condit = require('./condit');
const index = require('../src/index');

describe('Integration Tests', () => {
  condit('Retrieve Performance results from Calibre', condit.hasenv('HLX_CALIBRE_AUTH'), async () => {
    const results = await index({
      CALIBRE_AUTH: process.env.HLX_CALIBRE_AUTH,
      tests: [
        {
          url: 'https://www.project-helix.io',
          location: 'London',
          device: 'MotorolaMotoG4',
          connection: 'regular3G',
          strain: 'default',
        },
        {
          url: 'https://www.adobe.io',
          location: 'London',
          device: 'MotorolaMotoG4',
          connection: 'regular3G',
          strain: 'default',
        }
      ]
    });

    assert.equal(results.length, 2);
    const r1 = results[0];
    assert.equal(r1.test.url, 'https://www.project-helix.io');
    assert.equal(typeof r1.uuid, 'string');
    assert.equal(typeof r1.result, 'object');
    assert.ok(Array.isArray(r1.result.metrics));
    assert.equal(typeof r1.result.metrics[0].value, 'number');
  }).timeout(1000*60*5);
});
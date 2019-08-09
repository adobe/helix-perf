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
const perf = require('../src/perf');

describe('Integration Tests', () => {
  it('Rejects attempts to consume service without authentication', (done) => {
    perf({ __ow_method: 'post' }).then((result) => {
      assert.equal(result.statusCode, 401);
      done();
    }).catch(() => done);
  });

  condit(
    'Fail when called with invalid configuration',
    condit.hasenvs(['HLX_CALIBRE_AUTH', 'HLX_FASTLY_AUTH', 'HLX_FASTLY_NAMESPACE']),
    async () => {
      const results = await perf({
        __ow_method: 'post',
        CALIBRE_API_TOKEN: process.env.HLX_CALIBRE_AUTH,
        service: process.env.HLX_FASTLY_NAMESPACE,
        token: process.env.HLX_FASTLY_AUTH,
        tests: [
          {
            url: 'https://www.project-helix.io',
            location: 'London',
            device: 'Nokia7110',
            connection: 'regular3G',
            strain: 'default',
          },
          {
            url: 'https://www.adobe.io',
            location: 'London',
            device: 'Nokia7110',
            connection: 'regular3G',
            strain: 'default',
          },
        ],
      });

      assert.equal(results.statusCode, 500);
    },
  ).timeout(1000 * 60 * 9);

  condit(
    'Fail to retrieve when called with invalid configuration',
    condit.hasenvs(['HLX_CALIBRE_AUTH', 'HLX_FASTLY_AUTH', 'HLX_FASTLY_NAMESPACE']),
    async () => {
      const results = await perf({
        __ow_method: 'post',
        CALIBRE_API_TOKEN: process.env.HLX_CALIBRE_AUTH,
        service: process.env.HLX_FASTLY_NAMESPACE,
        token: process.env.HLX_FASTLY_AUTH,
        tests: [
          'nope', 'doesntexit',
        ],
      });

      assert.equal(results.statusCode, 500);
    },
  ).timeout(1000 * 60 * 9);

  condit(
    'Fail when called with invalid credentials',
    condit.hasenvs(['HLX_CALIBRE_AUTH', 'HLX_FASTLY_AUTH', 'HLX_FASTLY_NAMESPACE']),
    async () => {
      const results = await perf({
        __ow_method: 'post',
        CALIBRE_API_TOKEN: process.env.HLX_CALIBRE_AUTH,
        service: 'wrong',
        token: 'fake',
        tests: [
          {
            url: 'https://www.project-helix.io',
            location: 'London',
            device: 'Nokia7110',
            connection: 'regular3G',
            strain: 'default',
          },
          {
            url: 'https://www.adobe.io',
            location: 'London',
            device: 'Nokia7110',
            connection: 'regular3G',
            strain: 'default',
          },
        ],
      });

      assert.equal(results.statusCode, 401);
    },
  ).timeout(1000 * 60 * 9);

  condit(
    'Fail when retrieving with invalid credentials',
    condit.hasenvs(['HLX_CALIBRE_AUTH', 'HLX_FASTLY_AUTH', 'HLX_FASTLY_NAMESPACE']),
    async () => {
      const results = await perf({
        __ow_method: 'post',
        CALIBRE_API_TOKEN: process.env.HLX_CALIBRE_AUTH,
        service: 'wrong',
        token: 'fake',
        tests: ['one', 'two'],
      });

      assert.equal(results.statusCode, 401);
    },
  ).timeout(1000 * 60 * 9);

  condit(
    'Retrieve Performance results from Calibre',
    condit.hasenvs(['HLX_CALIBRE_AUTH', 'HLX_FASTLY_AUTH', 'HLX_FASTLY_NAMESPACE']),
    async () => {
      const schedule = await perf({
        __ow_method: 'post',
        CALIBRE_API_TOKEN: process.env.HLX_CALIBRE_AUTH,
        service: process.env.HLX_FASTLY_NAMESPACE,
        token: process.env.HLX_FASTLY_AUTH,
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
          },
        ],
      });

      assert.equal(schedule.body.length, 2);

      let i = 0;
      // eslint-disable-next-line no-plusplus
      while (i++ < 100) {
        // eslint-disable-next-line no-await-in-loop
        const results = await perf({
          __ow_method: 'post',
          tests: schedule.body,
          CALIBRE_API_TOKEN: process.env.HLX_CALIBRE_AUTH,
          service: process.env.HLX_FASTLY_NAMESPACE,
          token: process.env.HLX_FASTLY_AUTH,
        });

        assert.equal(results.body.length, 2);
        if (results.body.reduce((p, result) => p && typeof result === 'object', true)) {
          const r1 = results.body[0];
          assert.equal(r1.url, 'https://www.project-helix.io');
          assert.equal(typeof r1.uuid, 'string');
          assert.ok(Array.isArray(r1.metrics));
          assert.equal(typeof r1.metrics[0].value, 'number');

          break;
        } else {
          // eslint-disable-next-line no-console
          console.log(`results have not yet arrived after ${i} iterations`);
        }
      }
    },
  ).timeout(1000 * 60 * 9);
});

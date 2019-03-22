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

'use strict';

const assert = require('assert');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('Mocked Tests', () => {
  const example = {
    uuid: '170b278',
    url: 'https://debug.primordialsoup.life/develop/',
    formattedTestUrl: 'https://calibreapp.com/tests/170b278/4161820',
    status: 'completed',
    updatedAt: '2018-08-29T13:00:08Z',
    metrics: [
      { name: 'speed_index', label: 'Speed Index', value: 1233 },
      {
        name: 'visually_complete',
        label: 'Visually Complete',
        value: 1233,
      },
      {
        name: 'visually_complete_85',
        label: '85% Visually Complete',
        value: 1233,
      },
      {
        name: 'lighthouse-seo-score',
        label: 'Lighthouse SEO Score',
        value: 44,
      },
      {
        name: 'lighthouse-best-practices-score',
        label: 'Lighthouse Best Practices Score',
        value: 87,
      },
      {
        name: 'lighthouse-accessibility-score',
        label: 'Lighthouse Accessibility Score',
        value: 50,
      },
      {
        name: 'lighthouse-performance-score',
        label: 'Lighthouse Performance Score',
        value: 99,
      },
      {
        name: 'lighthouse-pwa-score',
        label: 'Lighthouse Progressive Web App Score',
        value: 36,
      },
      {
        name: 'js-parse-compile',
        label: 'JS Parse & Compile',
        value: 0,
      },
      {
        name: 'time-to-first-byte',
        label: 'Time to First Byte',
        value: 1064,
      },
      {
        name: 'first-contentful-paint',
        label: 'First Contentful Paint',
        value: 1218,
      },
      {
        name: 'first-meaningful-paint',
        label: 'First Meaningful Paint',
        value: 1218,
      },
      { name: 'firstRender', label: 'First Paint', value: 1218 },
      { name: 'dom-size', label: 'DOM Element Count', value: 3 },
      {
        name: 'estimated-input-latency',
        label: 'Estimated input latency',
        value: 16,
      },
      {
        name: 'consistently-interactive',
        label: 'Time to Interactive',
        value: 1218,
      },
      {
        name: 'first-interactive',
        label: 'First CPU Idle',
        value: 1218,
      },
      {
        name: 'html_body_size_in_bytes',
        label: 'Total HTML size in bytes',
        value: 80,
      },
      {
        name: 'html_size_in_bytes',
        label: 'Total HTML transferred',
        value: 239,
      },
      { name: 'page_wait_timing', label: 'Response time', value: 1236 },
      {
        name: 'page_size_in_bytes',
        label: 'Total Page transferred',
        value: 239,
      },
      {
        name: 'page_body_size_in_bytes',
        label: 'Total Page size in bytes',
        value: 80,
      },
      { name: 'asset_count', label: 'Number of requests', value: 1 },
      { name: 'onload', label: 'onLoad', value: 1196 },
      { name: 'oncontentload', label: 'onContentLoad', value: 1198 },
    ],
    device: { title: 'Motorola Moto G4' },
    connection: { title: 'Regular 3G' },
    location: { name: 'London, United Kingdom', emoji: '🇬🇧' },
  };

  const fakecreate = sinon.fake.resolves({ uuid: '170b278' });
  const fakewait = sinon.fake.resolves(example);
  const index = proxyquire('../src/index', {
    calibre: {
      Test: {
        create: fakecreate,
        waitForTest: fakewait,
      },
    },
    '@adobe/fastly-native-promises': () => ({
      readVersions: sinon.fake.resolves(true),
    }),
  });

  it('Works without arguments', async () => {
    const result = await index({ CALIBRE_AUTH: 'FAKE' });
    assert.deepEqual(result.statusCode, 200);
  });

  it('Can run tests', async () => {
    const result = await index({
      CALIBRE_AUTH: 'FAKE',
      tests: [
        {
          url: 'https://www.project-helix.io',
          location: 'London',
          device: 'MotorolaMotoG4',
          connection: 'regular3G',
          strain: 'default',
        },
        {
          url: 'https://www.project-helix.io',
          location: 'London',
          device: 'MotorolaMotoG4',
          connection: 'regular3G',
          strain: 'default',
        },
      ],
    });
    assert.deepEqual(result, [Object.assign({
      uuid: '170b278',
    }, example),
    Object.assign(
      {
        uuid: '170b278',
      }, example,
    )]);
  });
});

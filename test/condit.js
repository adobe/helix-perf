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

function condit(name, condition, mochafn) {
  if (condition()) {
    return it(name, mochafn);
  }
  return it.skip(`${name} (${condition.description || 'condition not met'})`, mochafn);
}

condit.hasenv = (name) => {
  class fn {
    constructor() {
      return !!process.env[name];
    }
  }
  fn.description = `env var ${name} must be set`;
  return fn;
};

condit.hasenvs = (names) => {
  const fn = function envs() {
    return names.reduce((p, c) => p && !!process.env[c], true);
  };

  fn.description = `env vars ${names.join(', ')} must be set`;
  return fn;
};

module.exports = condit;

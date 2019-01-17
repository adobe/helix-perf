# Repository Template

## Status
[![codecov](https://img.shields.io/codecov/c/github/adobe-rnd/new-nodejs-repository-template.svg)](https://codecov.io/gh/adobe-rnd/new-nodejs-repository-template)
[![CircleCI](https://img.shields.io/circleci/project/github/adobe-rnd/new-nodejs-repository-template.svg)](https://circleci.com/gh/adobe-rnd/new-nodejs-repository-template)
[![GitHub license](https://img.shields.io/github/license/adobe-rnd/new-nodejs-repository-template.svg)](https://github.com/adobe-rnd/new-nodejs-repository-template/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe-rnd/new-nodejs-repository-template.svg)](https://github.com/adobe-rnd/new-nodejs-repository-template/issues)
[![LGTM Code Quality Grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/adobe-rnd/new-nodejs-repository-template.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/adobe-rnd/new-nodejs-repository-template)

> Microservice for getting Project Helix performance results

This microservice runs performance tests on a customer website using Calibreapp, but only if the customer has a valid Project Helix account.

## Usage

Send a POST request with following (`Content-Type: application/json`-encoded) body parameters to `https://adobeioruntime.net/api/v1/web/helix/default/perf`:

* `service`: the service ID of your Fastly service config
* `token`: a Fastly authentication token that has `global` permission on the service config
* `tests`: an array of test specs, i.e. objects with following properties
  * `url`: the URL to test
  * `location`: the remote location to test from
  * `device`: the device emulate during the test
  * `connection`: the connection throttling settings
  * `strain`: the strain or variant to test

## Developing Helix Perf

You need `node>=8.0.0` and `npm>=5.4.0`. Follow the typical `npm install`, `npm test` workflow.

Contributions are highly welcome.

## Deploying Helix Perf

Deploying Helix Perf requires the `wsk` command line client, authenticated to a namespace of your choice. For Project Helix, we use the `helix` namespace.

Run `npm run deploy` to do a one-shot deploment of Helix Perf. All commits to master that pass the testing will be deployed automatically.


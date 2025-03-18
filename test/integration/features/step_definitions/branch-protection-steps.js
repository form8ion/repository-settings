import {promises as fs} from 'node:fs';
import {load} from 'js-yaml';
import {fileTypes, mergeIntoExistingConfigFile} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Given('classic branch protection is not configured', async function () {
  return undefined;
});

Given('classic branch protection is disabled', async function () {
  await mergeIntoExistingConfigFile({
    format: fileTypes.YAML,
    path: `${this.projectRoot}/.github`,
    name: 'settings',
    config: {branches: [{name: 'master', protection: null}]}
  });
});

Then('classic branch protection has been disabled', async function () {
  const {branches} = load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8'));

  assert.deepEqual(branches, [{name: 'master', protection: null}]);
});

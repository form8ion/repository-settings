import {promises as fs} from 'node:fs';
import {load} from 'js-yaml';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Given('classic branch protection is not configured', async function () {
  return undefined;
});

Then('classic branch protection is disabled', async function () {
  const {branches} = load(await fs.readFile(`${process.cwd()}/.github/settings.yml`, 'utf-8'));

  assert.deepEqual(branches, [{name: 'master', protection: null}]);
});

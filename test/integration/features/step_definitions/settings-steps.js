import {promises as fs} from 'node:fs';
import {dump, load} from 'js-yaml';

import {assert} from 'chai';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';

Given('the GitHub repository settings are managed by the repository-settings app', async function () {
  this.existingSettingsContent = {...any.simpleObject(), repository: {...any.simpleObject(), homepage: any.url()}};

  await fs.mkdir(`${this.projectRoot}/.github`, {recursive: true});
  await fs.writeFile(
    `${this.projectRoot}/.github/settings.yml`,
    dump(this.existingSettingsContent)
  );
});

Given('the GitHub repository settings are not managed by the repository-settings app', async function () {
  return undefined;
});

Then('properties are updated in the settings file', async function () {
  assert.deepEqual(
    load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8')),
    {
      ...this.existingSettingsContent,
      repository: {
        ...this.existingSettingsContent.repository,
        ...this.homepage && {homepage: this.homepage},
        ...(this.tags || this.existingTags) && {topics: [...this.existingTags || [], ...this.tags || []].join(', ')}
      },
      branches: [{name: 'master', protection: null}],
      rulesets: [{
        name: 'prevent destruction of the default branch',
        target: 'branch',
        enforcement: 'active',
        conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
        rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
      }]
    }
  );
});

Then('no updates are attempted to a settings file', async function () {
  return undefined;
});

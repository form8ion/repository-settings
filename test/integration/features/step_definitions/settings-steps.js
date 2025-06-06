import {promises as fs} from 'node:fs';
import {dump, load} from 'js-yaml';

import {assert} from 'chai';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';

Given('the GitHub repository settings are managed by the repository-settings app', async function () {
  this.existingSettingsContent = {...any.simpleObject(), repository: {...any.simpleObject(), homepage: any.url()}};

  await fs.writeFile(
    `${this.projectRoot}/.github/settings.yml`,
    dump(this.existingSettingsContent)
  );
});

Given('the GitHub repository settings are not managed by the repository-settings app', async function () {
  return undefined;
});

Then('repository details are updated in the settings file', async function () {
  const {repository} = load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8'));

  assert.deepEqual(
    repository,
    {
      ...this.existingSettingsContent.repository,
      ...this.homepage && {homepage: this.homepage},
      ...(this.tags || this.existingTags) && {topics: [...this.existingTags || [], ...this.tags || []].join(', ')}
    }
  );
});

Then('no updates are attempted to a settings file', async function () {
  return undefined;
});

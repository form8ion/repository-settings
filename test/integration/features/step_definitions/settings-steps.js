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

Given('the existing settings file includes existing tags', async function () {
  this.existingTags = any.listOf(any.word);

  const existingSettings = load(await fs.readFile(
    `${this.projectRoot}/.github/settings.yml`,
    'utf-8'
  ));
  await fs.writeFile(
    `${this.projectRoot}/.github/settings.yml`,
    dump({...existingSettings, repository: {...existingSettings.repository, topics: this.existingTags.join(', ')}})
  );
});

Then('repository settings are configured', async function () {
  const settings = load(await fs.readFile(`${process.cwd()}/.github/settings.yml`, 'utf-8'));

  assert.deepEqual(
    settings,
    {
      _extends: '.github',
      repository: {
        name: this.projectName,
        description: this.projectDescription,
        homepage: this.projectHomepage,
        private: 'Public' !== this.projectVisibility,
        topics: this.topics.join(', ')
      }
    }
  );
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
      }
    }
  );
});

Then('no updates are attempted to a settings file', async function () {
  return undefined;
});

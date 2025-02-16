import {promises as fs} from 'node:fs';
import {dump, load} from 'js-yaml';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

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

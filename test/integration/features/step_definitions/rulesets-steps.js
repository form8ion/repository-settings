import {promises as fs} from 'node:fs';
import {load} from 'js-yaml';
import {fileTypes, mergeIntoExistingConfigFile} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

Given('rulesets are configured', async function () {
  this.existingRulesets = any.listOf(any.simpleObject);

  await mergeIntoExistingConfigFile({
    format: fileTypes.YAML,
    path: `${this.projectRoot}/.github`,
    name: 'settings',
    config: {rulesets: this.existingRulesets}
  });
});

Given('rulesets are not configured', async function () {
  return undefined;
});

Then('rulesets include a rule to prevent destruction of the default branch', async function () {
  const {rulesets} = load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8'));

  assert.deepNestedInclude(
    rulesets,
    {
      name: 'prevent destruction of the default branch',
      target: 'branch',
      enforcement: 'active',
      conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
      rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
    }
  );
});

Then('existing rulesets are untouched', async function () {
  const {rulesets} = load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8'));

  assert.deepEqual(rulesets, this.existingRulesets);
});

Then('rulesets include a rule to require verification to pass', async function () {
  const {rulesets} = load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8'));

  assert.deepNestedInclude(
    rulesets,
    {
      name: 'verification must pass',
      target: 'branch',
      enforcement: 'active',
      conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
      rules: [{
        type: 'required_status_checks',
        parameters: {
          strict_required_status_checks_policy: false,
          required_status_checks: [{context: 'workflow-result', integration_id: 15368}]
        }
      }],
      bypass_actors: [{actor_id: 3208999, actor_type: 'Team', bypass_mode: 'always'}]
    }
  );
});

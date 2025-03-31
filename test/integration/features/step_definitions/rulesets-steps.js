import {promises as fs} from 'node:fs';
import {load} from 'js-yaml';
import {fileTypes, mergeIntoExistingConfigFile} from '@form8ion/core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

const GITHUB_ACTIONS_INTEGRATION_ID = 15368;

Given('rulesets are configured', async function () {
  this.existingRulesets = [
    ...this.existingRulesets,
    {
      name: 'prevent destruction of the default branch',
      target: 'branch',
      enforcement: 'active',
      conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
      rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
    },
    ...any.listOf(() => ({...any.simpleObject, name: any.word()}))
  ];

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

Given('required checks are not configured', async function () {
  return undefined;
});

Given('required checks are configured', async function () {
  this.existingRulesets = [
    ...this.existingRulesets,
    {
      name: 'verification must pass',
      target: 'branch',
      enforcement: 'active',
      conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
      rules: [{
        type: 'required_status_checks',
        parameters: {
          strict_required_status_checks_policy: false,
          required_status_checks: [{context: 'workflow-result', integration_id: GITHUB_ACTIONS_INTEGRATION_ID}]
        }
      }],
      bypass_actors: [{actor_id: 3208999, actor_type: 'Team', bypass_mode: 'always'}]
    }
  ];
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
  assert.equal(rulesets.filter(rule => 'prevent destruction of the default branch' === rule.name).length, 1);
});

Then('existing rulesets are untouched', async function () {
  const {rulesets} = load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8'));

  this.existingRulesets.forEach(existingRuleset => assert.deepNestedInclude(rulesets, existingRuleset));
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
          required_status_checks: [{context: 'workflow-result', integration_id: GITHUB_ACTIONS_INTEGRATION_ID}]
        }
      }],
      bypass_actors: [{actor_id: 3208999, actor_type: 'Team', bypass_mode: 'always'}]
    }
  );
  assert.equal(rulesets.filter(rule => 'verification must pass' === rule.name).length, 1);
});

import {Given, Then} from '@cucumber/cucumber';
import {load} from 'js-yaml';
import {promises as fs} from 'fs';
import {assert} from 'chai';

Given('rulesets are not configured', async function () {
  return undefined;
});

Then('rulesets include a rule to prevent destruction of the default branch', async function () {
  const {rulesets} = load(await fs.readFile(`${process.cwd()}/.github/settings.yml`, 'utf-8'));

  assert.deepEqual(
    rulesets,
    [{
      name: 'prevent destruction of the default branch',
      target: 'branch',
      enforcement: 'active',
      conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
      rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
    }]
  );
});

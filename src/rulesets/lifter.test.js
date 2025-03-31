import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import liftRulesets from './lifter.js';

describe('rulesets details lifter', () => {
  const GITHUB_ACTIONS_INTEGRATION_ID = 15368;

  it('should define rules to prevent destruction of the default branch and require verification to pass', async () => {
    expect(liftRulesets({})).toEqual([
      {
        name: 'prevent destruction of the default branch',
        target: 'branch',
        enforcement: 'active',
        conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
        rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
      },
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
    ]);
  });

  it('should append to the existing rulesets', async () => {
    const existingRulesets = any.listOf(() => ({...any.simpleObject, name: any.word()}));

    expect(liftRulesets({existingRulesets})).toEqual([
      ...existingRulesets,
      {
        name: 'prevent destruction of the default branch',
        target: 'branch',
        enforcement: 'active',
        conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
        rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
      },
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
    ]);
  });

  it('should avoid appending duplicates to the existing rulesets', async () => {
    const existingRulesets = [
      {...any.simpleObject, name: 'prevent destruction of the default branch'},
      ...any.listOf(() => ({...any.simpleObject, name: any.word()})),
      {...any.simpleObject, name: 'verification must pass'}
    ];

    expect(liftRulesets({existingRulesets})).toEqual(existingRulesets);
  });
});

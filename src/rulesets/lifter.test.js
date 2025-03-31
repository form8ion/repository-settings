import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import liftRulesets from './lifter.js';

describe('rulesets details lifter', () => {
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
            required_status_checks: [{context: 'workflow-result', integration_id: 15368}]
          }
        }],
        bypass_actors: [{actor_id: 3208999, actor_type: 'Team', bypass_mode: 'always'}]
      }
    ]);
  });

  it('should return existing rulesets unchanged', async () => {
    const existingRulesets = any.listOf(any.simpleObject);

    expect(liftRulesets({existingRulesets})).toEqual(existingRulesets);
  });
});

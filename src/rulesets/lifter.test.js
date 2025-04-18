import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {requiredCheckBypassPrompt} from '../prompt/index.js';
import liftRulesets from './lifter.js';

vi.mock('../prompt/index.js');

describe('rulesets details lifter', () => {
  const GITHUB_ACTIONS_INTEGRATION_ID = 15368;
  const prompt = () => undefined;
  const bypassTeamId = any.integer();

  it('should define rules to prevent destruction of the default branch and require verification to pass', async () => {
    when(requiredCheckBypassPrompt).calledWith(prompt).thenResolve({team: bypassTeamId});

    expect(await liftRulesets({}, {prompt})).toEqual([
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
        bypass_actors: [{actor_id: bypassTeamId, actor_type: 'Team', bypass_mode: 'always'}]
      }
    ]);
  });

  it('should append to the existing rulesets', async () => {
    const existingRulesets = any.listOf(() => ({...any.simpleObject, name: any.word()}));
    when(requiredCheckBypassPrompt).calledWith(prompt).thenResolve({team: bypassTeamId});

    expect(await liftRulesets({existingRulesets}, {prompt})).toEqual([
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
        bypass_actors: [{actor_id: bypassTeamId, actor_type: 'Team', bypass_mode: 'always'}]
      }
    ]);
  });

  it('should avoid appending duplicates to the existing rulesets', async () => {
    const existingRulesets = [
      {...any.simpleObject, name: 'prevent destruction of the default branch'},
      ...any.listOf(() => ({...any.simpleObject, name: any.word()})),
      {...any.simpleObject, name: 'verification must pass'}
    ];

    expect(await liftRulesets({existingRulesets}, {})).toEqual(existingRulesets);
  });
});

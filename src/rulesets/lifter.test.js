import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {requiredCheckBypassPrompt} from '../prompt/index.js';
import liftRulesets from './lifter.js';

vi.mock('../prompt/index.js');

describe('rulesets details lifter', () => {
  const GITHUB_ACTIONS_INTEGRATION_ID = 15368;
  const prompt = () => undefined;
  const octokit = any.simpleObject();
  const vcs = any.simpleObject();
  const bypassTeamId = any.integer();
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  it('should define rules to prevent destruction of the default branch and require verification to pass', async () => {
    when(requiredCheckBypassPrompt).calledWith(vcs, {prompt, octokit, logger}).thenResolve({team: bypassTeamId});

    expect(await liftRulesets({vcs}, {prompt, logger, octokit})).toEqual([
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
    when(requiredCheckBypassPrompt).calledWith(vcs, {prompt, octokit}).thenResolve({team: bypassTeamId});

    expect(await liftRulesets({existingRulesets, vcs}, {prompt, logger, octokit})).toEqual([
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

    expect(await liftRulesets({existingRulesets}, {logger})).toEqual(existingRulesets);
  });
});

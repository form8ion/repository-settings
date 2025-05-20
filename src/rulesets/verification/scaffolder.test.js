import {describe, expect, vi, it} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {scaffold as scaffoldBypassActors} from './bypass-actors/index.js';
import scaffoldVerificationRuleset from './scaffolder.js';

vi.mock('./bypass-actors/index.js');

describe('verification ruleset scaffolder', () => {
  const GITHUB_ACTIONS_INTEGRATION_ID = 15368;
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  it('should define a rule that requires the `workflow-result` job to pass', async () => {
    const vcs = any.simpleObject();
    const octokit = any.simpleObject();
    const prompt = () => undefined;
    const bypassActors = any.simpleObject();
    when(scaffoldBypassActors).calledWith(vcs, {octokit, prompt}).thenResolve(bypassActors);

    expect(await scaffoldVerificationRuleset({vcs}, {octokit, prompt, logger})).toEqual({
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
      ...bypassActors
    });
  });
});

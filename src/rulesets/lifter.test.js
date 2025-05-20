import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {scaffold as scaffoldVerificationRuleset} from './verification/index.js';
import liftRulesets from './lifter.js';

vi.mock('./verification/index.js');

describe('rulesets details lifter', () => {
  const prompt = () => undefined;
  const octokit = any.simpleObject();
  const vcs = any.simpleObject();
  const verificationRuleset = any.simpleObject();
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  it('should define rules to prevent destruction of the default branch and require verification to pass', async () => {
    when(scaffoldVerificationRuleset).calledWith({vcs}, {prompt, octokit, logger}).thenResolve(verificationRuleset);

    expect(await liftRulesets({vcs}, {prompt, logger, octokit})).toEqual([
      {
        name: 'prevent destruction of the default branch',
        target: 'branch',
        enforcement: 'active',
        conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
        rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
      },
      verificationRuleset
    ]);
  });

  it('should append to the existing rulesets', async () => {
    const existingRulesets = any.listOf(() => ({...any.simpleObject, name: any.word()}));
    when(scaffoldVerificationRuleset).calledWith({vcs}, {prompt, octokit, logger}).thenResolve(verificationRuleset);

    expect(await liftRulesets({existingRulesets, vcs}, {prompt, logger, octokit})).toEqual([
      ...existingRulesets,
      {
        name: 'prevent destruction of the default branch',
        target: 'branch',
        enforcement: 'active',
        conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
        rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
      },
      verificationRuleset
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

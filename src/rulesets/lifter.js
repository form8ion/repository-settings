import uniqBy from 'lodash.uniqby';

import {scaffold as scaffoldVerificationRuleset} from './verification/index.js';

async function defineVerificationRule({existingRulesets, vcs}, {prompt, logger, octokit}) {
  if (existingRulesets.find(ruleset => 'verification must pass' === ruleset.name)) {
    return undefined;
  }

  return scaffoldVerificationRuleset({vcs}, {octokit, prompt, logger});
}

export default async function liftRulesets({existingRulesets = [], vcs}, {prompt, logger, octokit}) {
  logger.info('Lifting rulesets', {level: 'secondary'});

  return uniqBy(
    [
      ...existingRulesets,
      {
        name: 'prevent destruction of the default branch',
        target: 'branch',
        enforcement: 'active',
        conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
        rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
      },
      await defineVerificationRule({existingRulesets, vcs}, {prompt, logger, octokit})
    ].filter(Boolean),
    'name'
  );
}

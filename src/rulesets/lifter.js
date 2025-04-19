import uniqBy from 'lodash.uniqby';

import {requiredCheckBypassPrompt} from '../prompt/index.js';

const GITHUB_ACTIONS_INTEGRATION_ID = 15368;

async function constructVerificationRule(existingRulesets, {prompt, logger}) {
  if (existingRulesets.find(ruleset => 'verification must pass' === ruleset.name)) {
    return undefined;
  }

  logger.info('Defining verification ruleset', {level: 'secondary'});

  const {team} = await requiredCheckBypassPrompt(prompt);

  return {
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
    bypass_actors: [{actor_id: team, actor_type: 'Team', bypass_mode: 'always'}]
  };
}

export default async function liftRulesets({existingRulesets = []}, {prompt, logger}) {
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
      await constructVerificationRule(existingRulesets, {prompt, logger})
    ].filter(Boolean),
    'name'
  );
}

import uniqBy from 'lodash.uniqby';

import {requiredCheckBypassPrompt} from '../prompt/index.js';

const GITHUB_ACTIONS_INTEGRATION_ID = 15368;

async function constructVerificationRule(prompt, existingRulesets) {
  if (existingRulesets.find(ruleset => 'verification must pass' === ruleset.name)) {
    return undefined;
  }

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

export default async function liftRulesets({existingRulesets = []}, {prompt}) {
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
      await constructVerificationRule(prompt, existingRulesets)
    ].filter(Boolean),
    'name'
  );
}

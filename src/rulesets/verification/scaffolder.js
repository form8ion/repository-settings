import {scaffold as scaffoldBypassActors} from './bypass-actors/index.js';

const GITHUB_ACTIONS_INTEGRATION_ID = 15368;

export default async function scaffoldVerificationRuleset({vcs}, {octokit, prompt, logger}) {
  logger.info('Defining verification ruleset', {level: 'secondary'});

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
    ...await scaffoldBypassActors(vcs, {octokit, prompt, logger})
  };
}

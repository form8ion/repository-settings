import uniqBy from 'lodash.uniqby';

const GITHUB_ACTIONS_INTEGRATION_ID = 15368;

export default function ({existingRulesets}) {
  return uniqBy(
    [
      ...existingRulesets || [],
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
    ],
    'name'
  );
}

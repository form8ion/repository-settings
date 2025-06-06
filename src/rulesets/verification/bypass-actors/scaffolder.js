import {requiredCheckBypassPrompt} from '../../../prompt/index.js';

export default async function scaffoldBypassActors(vcs, {octokit, prompt, logger}) {
  try {
    const {team, role} = await requiredCheckBypassPrompt(vcs, {prompt, octokit});

    return {
      ...team && {bypass_actors: [{actor_id: team, actor_type: 'Team', bypass_mode: 'always'}]},
      ...role && {bypass_actors: [{actor_id: role, actor_type: 'RepositoryRole', bypass_mode: 'always'}]}
    };
  } catch (error) {
    if ('ERR_MISSING_OCTOKIT_INSTANCE' === error.code) {
      logger.warn('Unable to configure bypass actors without an octokit instance');

      return {};
    }

    throw error;
  }
}

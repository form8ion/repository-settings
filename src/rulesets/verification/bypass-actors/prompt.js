import {ids, questionNames} from '../../../prompt/constants.js';

export const ADMIN_ROLE_ID = 5;

export default async function promptForCheckBypass(vcs, {prompt, octokit}) {
  const promptId = ids.REQUIRED_CHECK_BYPASS;
  const checkBypassTeamQuestionName = questionNames[promptId].CHECK_BYPASS_TEAM;

  if (!octokit) {
    const missingOctokitError = new Error('No octokit instance provided');
    missingOctokitError.code = 'ERR_MISSING_OCTOKIT_INSTANCE';

    throw missingOctokitError;
  }

  const {data: {login: authenticatedUser}} = await octokit.request('GET /user');

  if (vcs.owner === authenticatedUser) {
    return {role: ADMIN_ROLE_ID};
  }

  const {data: teams} = await octokit.request('GET /orgs/{org}/teams', {org: vcs.owner});

  const {[checkBypassTeamQuestionName]: teamId} = await prompt({
    id: promptId,
    questions: [
      {
        type: 'list',
        name: checkBypassTeamQuestionName,
        message: 'Which team should be able to bypass the required checks?',
        choices: teams.map(({name, slug, id}) => ({name, value: id, short: slug}))
      }
    ]
  });

  return {team: teamId};
}

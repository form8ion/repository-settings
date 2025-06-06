import {ids, questionNames} from '../../../prompt/constants.js';

export const ADMIN_ROLE_ID = 5;

async function defineQuestionToChooseBypassTeam(checkBypassTeamQuestionName, vcs, octokit) {
  const {data: teams} = await octokit.request('GET /orgs/{org}/teams', {org: vcs.owner});

  return {
    type: 'list',
    name: checkBypassTeamQuestionName,
    message: 'Which team should be able to bypass the required checks?',
    choices: teams.map(({name, slug, id}) => ({name, value: id, short: slug}))
  };
}

async function defineQuestionToConfirmAdminBypass(adminBypassQuestionName) {
  return {
    type: 'confirm',
    name: adminBypassQuestionName,
    message: 'Should repository admins be able to bypass the required checks?'
  };
}

export default async function promptForCheckBypass(vcs, {prompt, octokit}) {
  const promptId = ids.REQUIRED_CHECK_BYPASS;
  const {
    [questionNames[promptId].CHECK_BYPASS_TEAM]: checkBypassTeamQuestionName,
    [questionNames[promptId].ADMIN_BYPASS]: adminBypassQuestionName
  } = questionNames[promptId];

  if (!octokit) {
    const missingOctokitError = new Error('No octokit instance provided');
    missingOctokitError.code = 'ERR_MISSING_OCTOKIT_INSTANCE';

    throw missingOctokitError;
  }

  const {data: {login: authenticatedUser}} = await octokit.request('GET /user');

  const {
    [checkBypassTeamQuestionName]: teamId,
    [adminBypassQuestionName]: adminBypass
  } = await prompt({
    id: promptId,
    questions: [
      vcs.owner === authenticatedUser
        ? await defineQuestionToConfirmAdminBypass(adminBypassQuestionName)
        : await defineQuestionToChooseBypassTeam(checkBypassTeamQuestionName, vcs, octokit)
    ]
  });

  return {
    team: teamId,
    role: adminBypass && ADMIN_ROLE_ID
  };
}

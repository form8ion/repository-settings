import {ids, questionNames} from './constants.js';

export default async function promptForCheckBypass(prompt, octokit, vcs) {
  const promptId = ids.REQUIRED_CHECK_BYPASS;
  const checkBypassTeamQuestionName = questionNames[promptId].CHECK_BYPASS_TEAM;

  if (!octokit) {
    const {[checkBypassTeamQuestionName]: teamId} = await prompt({
      id: promptId,
      questions: [
        {
          name: checkBypassTeamQuestionName,
          message: 'Which team (by id) should be able to bypass the required checks?'
        }
      ]
    });

    return {team: teamId};
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

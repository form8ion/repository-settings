import {ids, questionNames} from './constants.js';

export default async function promptForCheckBypass(prompt) {
  const promptId = ids.REQUIRED_CHECK_BYPASS;
  const checkBypassTeamQuestionName = questionNames[promptId].CHECK_BYPASS_TEAM;

  const {[checkBypassTeamQuestionName]: teamName} = await prompt({
    id: promptId,
    questions: [
      {
        name: checkBypassTeamQuestionName,
        message: 'Which team should be able to bypass the required checks?'
      }
    ]
  });

  return {team: teamName};
}

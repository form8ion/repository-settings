import {describe, vi, it, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {questionNames, ids} from './constants.js';
import promptForCheckBypass from './required-check-bypass.js';

describe('required check bypass prompt', () => {
  it('should enable choosing a team to bypass the required check', async () => {
    const prompt = vi.fn();
    const teamName = any.word();
    const promptId = ids.REQUIRED_CHECK_BYPASS;
    const checkBypassTeamQuestionName = questionNames[promptId].CHECK_BYPASS_TEAM;
    when(prompt)
      .calledWith({
        id: promptId,
        questions: [
          {
            name: checkBypassTeamQuestionName,
            message: 'Which team should be able to bypass the required checks?'
          }
        ]
      })
      .thenResolve({[checkBypassTeamQuestionName]: teamName});

    expect(await promptForCheckBypass(prompt)).toEqual({team: teamName});
  });
});

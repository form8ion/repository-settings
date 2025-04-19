import {describe, vi, it, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {questionNames, ids} from './constants.js';
import promptForCheckBypass from './required-check-bypass.js';

describe('required check bypass prompt', () => {
  it('should enable choosing a team to bypass the required check', async () => {
    const prompt = vi.fn();
    const octokit = {request: vi.fn()};
    const repositoryOwner = any.word();
    const vcs = {...any.simpleObject(), owner: repositoryOwner};
    const teamName = any.word();
    const promptId = ids.REQUIRED_CHECK_BYPASS;
    const checkBypassTeamQuestionName = questionNames[promptId].CHECK_BYPASS_TEAM;
    const teams = any.listOf(() => ({id: any.integer(), name: any.word(), slug: any.word()}));
    const choices = teams.map(({id, name, slug}) => ({name, value: id, short: slug}));
    when(octokit.request).calledWith('GET /orgs/{org}/teams', {org: repositoryOwner}).thenResolve({data: teams});
    when(prompt)
      .calledWith({
        id: promptId,
        questions: [
          {
            type: 'list',
            name: checkBypassTeamQuestionName,
            message: 'Which team should be able to bypass the required checks?',
            choices
          }
        ]
      })
      .thenResolve({[checkBypassTeamQuestionName]: teamName});

    expect(await promptForCheckBypass(prompt, octokit, vcs)).toEqual({team: teamName});
  });
});

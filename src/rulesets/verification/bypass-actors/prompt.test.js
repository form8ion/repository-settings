import {describe, vi, it, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {questionNames, ids} from '../../../prompt/constants.js';
import promptForCheckBypass, {ADMIN_ROLE_ID} from './prompt.js';

describe('required check bypass prompt', () => {
  const promptId = ids.REQUIRED_CHECK_BYPASS;
  const {
    CHECK_BYPASS_TEAM: checkBypassTeamQuestionName,
    ADMIN_BYPASS: adminBypassQuestionName
  } = questionNames[promptId];
  const teamId = any.word();

  it('should enable choosing a team to bypass the required check for an organization owned repository', async () => {
    const octokit = {request: vi.fn()};
    const teams = any.listOf(() => ({id: any.integer(), name: any.word(), slug: any.word()}));
    const choices = teams.map(({id, name, slug}) => ({name, value: id, short: slug}));
    const prompt = vi.fn();
    const organization = any.word();
    const vcs = {...any.simpleObject(), owner: organization};
    when(octokit.request).calledWith('GET /user').thenResolve({data: {login: any.word()}});
    when(octokit.request).calledWith('GET /orgs/{org}/teams', {org: organization}).thenResolve({data: teams});
    when(prompt)
      .calledWith({
        id: promptId,
        questions: [{
          type: 'list',
          name: checkBypassTeamQuestionName,
          message: 'Which team should be able to bypass the required checks?',
          choices
        }]
      })
      .thenResolve({[checkBypassTeamQuestionName]: teamId});

    expect(await promptForCheckBypass(vcs, {prompt, octokit})).toEqual({team: teamId});
  });

  it('should enable the admin role to bypass the required check for a user owned repository', async () => {
    const prompt = vi.fn();
    const octokit = {request: vi.fn()};
    const user = any.word();
    const vcs = {...any.simpleObject(), owner: user};
    when(octokit.request).calledWith('GET /user').thenResolve({data: {login: user}});
    when(prompt)
      .calledWith({
        id: promptId,
        questions: [{
          type: 'confirm',
          name: adminBypassQuestionName,
          message: 'Should repository admins be able to bypass the required checks?'
        }]
      })
      .thenResolve({[adminBypassQuestionName]: true});

    expect(await promptForCheckBypass(vcs, {prompt, octokit})).toEqual({role: ADMIN_ROLE_ID});
  });

  it('should throw an error when no octokit instance is provided', async () => {
    await expect(promptForCheckBypass({}, {})).rejects.toThrowError('No octokit instance provided');
  });
});

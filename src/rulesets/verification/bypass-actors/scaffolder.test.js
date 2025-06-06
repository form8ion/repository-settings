import {describe, it, expect, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {requiredCheckBypassPrompt} from '../../../prompt/index.js';
import scaffoldBypassActors from './scaffolder.js';

vi.mock('../../../prompt/index.js');

describe('verification ruleset bypass-actors scaffolder', () => {
  const vcs = any.simpleObject();
  const octokit = any.simpleObject();
  const prompt = () => undefined;
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  it('should define the chosen team as a bypass actor', async () => {
    const team = any.integer();
    when(requiredCheckBypassPrompt).calledWith(vcs, {octokit, prompt}).thenResolve({team});

    expect(await scaffoldBypassActors(vcs, {octokit, prompt})).toEqual({
      bypass_actors: [{actor_id: team, actor_type: 'Team', bypass_mode: 'always'}]
    });
  });

  it('should define the admin role as a bypass actor', async () => {
    const role = any.integer();
    when(requiredCheckBypassPrompt).calledWith(vcs, {octokit, prompt}).thenResolve({role});

    expect(await scaffoldBypassActors(vcs, {octokit, prompt})).toEqual({
      bypass_actors: [{actor_id: role, actor_type: 'RepositoryRole', bypass_mode: 'always'}]
    });
  });

  it('should return an empty object when the prompt throws an error for a missing octokit instance', async () => {
    const error = new Error(any.sentence());
    error.code = 'ERR_MISSING_OCTOKIT_INSTANCE';
    when(requiredCheckBypassPrompt).calledWith(vcs, {prompt}).thenThrow(error);

    expect(await scaffoldBypassActors(vcs, {prompt, logger})).toEqual({});
  });

  it('should rethrow other errors', async () => {
    const error = new Error(any.sentence());
    when(requiredCheckBypassPrompt).calledWith(vcs, {octokit, prompt}).thenThrow(error);

    await expect(scaffoldBypassActors(vcs, {octokit, prompt})).rejects.toThrow(error);
  });
});

import {fileTypes, loadConfigFile, writeConfigFile} from '@form8ion/core';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import {lift as liftBranchProtection} from './branches/index.js';
import {lift as liftRepository} from './repository/index.js';
import {lift as liftRulesets} from './rulesets/index.js';
import lift from './lifter.js';

vi.mock('@form8ion/core');
vi.mock('./repository/index.js');
vi.mock('./branches/index.js');
vi.mock('./rulesets/index.js');

describe('lifter', () => {
  const projectRoot = any.simpleObject();
  const tags = any.listOf(any.word);
  const homepage = any.url();
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  it('should set properties in the settings file', async () => {
    const repositoryUpdates = any.simpleObject();
    const branchProtectionDetails = any.simpleObject();
    const rulesetsDetails = any.simpleObject();
    const existingRepositoryDetails = any.simpleObject();
    const existingRulesets = any.simpleObject();
    const existingConfig = {...any.simpleObject(), repository: existingRepositoryDetails, rulesets: existingRulesets};
    const vcs = any.simpleObject();
    const prompt = () => undefined;
    when(loadConfigFile)
      .calledWith({format: fileTypes.YAML, path: `${projectRoot}/.github`, name: 'settings'})
      .thenResolve(existingConfig);
    when(liftRepository).calledWith({homepage, tags, existingRepositoryDetails}).thenReturn(repositoryUpdates);
    when(liftBranchProtection).calledWith().thenReturn(branchProtectionDetails);
    when(liftRulesets).calledWith({existingRulesets, vcs}, {prompt}).thenResolve(rulesetsDetails);

    const result = await lift({projectRoot, results: {homepage, tags}, vcs}, {logger, prompt});

    expect(result).toEqual({});
    expect(writeConfigFile).toHaveBeenCalledWith({
      format: fileTypes.YAML,
      path: `${projectRoot}/.github`,
      name: 'settings',
      config: {
        ...existingConfig,
        repository: repositoryUpdates,
        branches: branchProtectionDetails,
        rulesets: rulesetsDetails
      }
    });
  });
});

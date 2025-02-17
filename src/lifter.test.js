import {fileTypes, mergeIntoExistingConfigFile} from '@form8ion/core';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import {lift as liftRepository} from './repository/index.js';
import lift from './lifter.js';

vi.mock('@form8ion/core');
vi.mock('./repository/index.js');

describe('lifter', () => {
  const projectRoot = any.simpleObject();
  const tags = any.listOf(any.word);
  const homepage = any.url();

  it('should set properties in the settings file', async () => {
    const repositoryUpdates = any.simpleObject();
    when(liftRepository).calledWith({homepage, tags}).thenReturn(repositoryUpdates);

    const result = await lift({projectRoot, results: {homepage, tags}});

    expect(result).toEqual({});
    expect(mergeIntoExistingConfigFile).toHaveBeenCalledWith({
      format: fileTypes.YAML,
      path: `${projectRoot}/.github`,
      name: 'settings',
      config: {repository: repositoryUpdates}
    });
  });
});

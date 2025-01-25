import {fileTypes, mergeIntoExistingConfigFile} from '@form8ion/core';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import lift from './lifter.js';

vi.mock('@form8ion/core');

describe('lifter', () => {
  const projectRoot = any.simpleObject();
  const tags = any.listOf(any.word);
  const homepage = any.url();

  it('should set properties in the settings file', async () => {
    const result = await lift({
      projectRoot,
      results: {homepage, tags}
    });

    expect(result).toEqual({});
    expect(mergeIntoExistingConfigFile).toHaveBeenCalledWith({
      format: fileTypes.YAML,
      path: `${projectRoot}/.github`,
      name: 'settings',
      config: {
        repository: {
          homepage,
          topics: tags.join(', ')
        }
      }
    });
  });

  it('should not result in an error when projectDetails are not provided in the results', async () => {
    await lift({
      projectRoot,
      results: {
        tags
      }
    });

    expect(mergeIntoExistingConfigFile).toHaveBeenCalledWith({
      format: fileTypes.YAML,
      path: `${projectRoot}/.github`,
      name: 'settings',
      config: {
        repository: {
          topics: tags.join(', ')
        }
      }
    });
  });

  it('should not result in an error when tags are not provided in the results', async () => {
    await lift({
      projectRoot,
      results: {homepage}
    });

    expect(mergeIntoExistingConfigFile).toHaveBeenCalledWith({
      format: fileTypes.YAML,
      path: `${projectRoot}/.github`,
      name: 'settings',
      config: {repository: {homepage}}
    });
  });
});

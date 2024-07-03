import {fileTypes, mergeIntoExistingConfigFile} from '@form8ion/core';

import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import lift from './lifter.js';

vi.mock('@form8ion/core');

describe('lifter', () => {
  it('should set properties in the settings file', async () => {
    const projectRoot = any.simpleObject();
    const homepage = any.url();
    const tags = any.listOf(any.word);

    const result = await lift({
      projectRoot,
      results: {
        projectDetails: {homepage},
        tags
      }
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
});

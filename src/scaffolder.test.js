import {promises as fs} from 'node:fs';
import {fileTypes, writeConfigFile} from '@form8ion/core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import {scaffold as scaffoldRepository} from './repository/index.js';
import scaffoldSettings from './scaffolder.js';

vi.mock('node:fs');
vi.mock('@form8ion/core');
vi.mock('./repository/index.js');

describe('settings', () => {
  const projectRoot = any.string();
  const projectName = any.string();
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should produce the settings file', async () => {
    const description = any.sentence();
    const homepage = any.url();
    const topics = any.listOf(any.word);
    const visibility = any.boolean();
    const repositoryDetails = any.simpleObject();
    when(scaffoldRepository)
      .calledWith({projectName, description, homepage, visibility, topics})
      .thenReturn(repositoryDetails);

    await scaffoldSettings({projectRoot, projectName, description, homepage, topics, visibility}, {logger});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github`, {recursive: true});
    expect(writeConfigFile).toHaveBeenCalledWith({
      path: `${projectRoot}/.github`,
      name: 'settings',
      format: fileTypes.YAML,
      config: {
        _extends: '.github',
        repository: repositoryDetails
      }
    });
  });
});

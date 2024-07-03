import {promises as fs} from 'node:fs';
import {fileTypes, writeConfigFile} from '@form8ion/core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import scaffoldSettings from './scaffolder.js';

vi.mock('node:fs');
vi.mock('@form8ion/core');

describe('settings', () => {
  const projectRoot = any.string();
  const projectName = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should produce the settings file', async () => {
    const description = any.sentence();
    const homepage = any.url();
    const topics = any.listOf(any.word);

    await scaffoldSettings({projectRoot, projectName, description, homepage, topics});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github`, {recursive: true});
    expect(writeConfigFile).toHaveBeenCalledWith({
      path: `${projectRoot}/.github`,
      name: 'settings',
      format: fileTypes.YAML,
      config: {
        _extends: '.github',
        repository: {
          name: projectName,
          description,
          homepage,
          private: true,
          topics: topics.join(', ')
        }
      }
    });
  });

  it('should mark the repository as private when the visibility is `Private`', async () => {
    await scaffoldSettings({projectRoot, visibility: 'Private'});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github`, {recursive: true});
    expect(writeConfigFile).toHaveBeenCalledWith({
      path: `${projectRoot}/.github`,
      name: 'settings',
      format: fileTypes.YAML,
      config: {
        _extends: '.github',
        repository: {
          private: true
        }
      }
    });
  });

  it('should mark the repository as not private when the visibility is `Public`', async () => {
    await scaffoldSettings({projectRoot, visibility: 'Public'});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github`, {recursive: true});
    expect(writeConfigFile).toHaveBeenCalledWith({
      path: `${projectRoot}/.github`,
      name: 'settings',
      format: fileTypes.YAML,
      config: {
        _extends: '.github',
        repository: {
          private: false
        }
      }
    });
  });

  it('should mark the repository as private when the visibility is not specified', async () => {
    await scaffoldSettings({projectRoot});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github`, {recursive: true});
    expect(writeConfigFile).toHaveBeenCalledWith({
      path: `${projectRoot}/.github`,
      name: 'settings',
      format: fileTypes.YAML,
      config: {
        _extends: '.github',
        repository: {
          private: true
        }
      }
    });
  });
});

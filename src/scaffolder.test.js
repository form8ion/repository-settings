import {promises as fs} from 'node:fs';
import jsYaml from 'js-yaml';
import * as mkdir from 'make-dir';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import scaffoldSettings from './scaffolder.js';

vi.mock('node:fs');
vi.mock('js-yaml');
vi.mock('make-dir');

describe('settings', () => {
  const projectRoot = any.string();
  const projectName = any.string();
  const dumpedYaml = any.string();
  const pathToCreatedGithubDirectory = any.string();

  beforeEach(() => {
    when(mkdir.default).calledWith(`${projectRoot}/.github`).mockResolvedValue(pathToCreatedGithubDirectory);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should produce the settings file', async () => {
    const description = any.sentence();
    const homepage = any.url();
    const topics = any.listOf(any.word);
    when(jsYaml.dump).calledWith({
      _extends: '.github',
      repository: {name: projectName, description, homepage, private: true, topics: topics.join(', ')}
    }).mockReturnValue(dumpedYaml);

    await scaffoldSettings({projectRoot, projectName, description, homepage, topics});

    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedGithubDirectory}/settings.yml`, dumpedYaml);
  });

  it('should mark the repository as private when the visibility is `Private`', async () => {
    when(jsYaml.dump).calledWith(expect.objectContaining({repository: {private: true}})).mockReturnValue(dumpedYaml);

    await scaffoldSettings({projectRoot, visibility: 'Private'});

    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedGithubDirectory}/settings.yml`, dumpedYaml);
  });

  it('should mark the repository as not private when the visibility is `Public`', async () => {
    when(jsYaml.dump).calledWith(expect.objectContaining({repository: {private: false}})).mockReturnValue(dumpedYaml);

    await scaffoldSettings({projectRoot, visibility: 'Public'});

    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedGithubDirectory}/settings.yml`, dumpedYaml);
  });

  it('should mark the repository as private when the visibility is not specified', async () => {
    when(jsYaml.dump).calledWith(expect.objectContaining({repository: {private: true}})).mockReturnValue(dumpedYaml);

    await scaffoldSettings({projectRoot});

    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedGithubDirectory}/settings.yml`, dumpedYaml);
  });
});

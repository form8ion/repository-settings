import {fileExists} from '@form8ion/core';

import {when} from 'jest-when';
import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import repositoryIsManagedBySettingsApp from './tester.js';

vi.mock('@form8ion/core');

describe('predicate', () => {
  const projectRoot = any.string();

  it('should return `true` if the settings file is present', async () => {
    when(fileExists).calledWith(`${projectRoot}/.github/settings.yml`).mockResolvedValue(true);

    expect(await repositoryIsManagedBySettingsApp({projectRoot})).toBe(true);
  });

  it('should return `false` if the settings file is not present', async () => {
    when(fileExists).calledWith(`${projectRoot}/.github/settings.yml`).mockResolvedValue(false);

    expect(await repositoryIsManagedBySettingsApp({projectRoot})).toBe(false);
  });
});

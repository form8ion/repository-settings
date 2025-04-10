import {fileExists} from '@form8ion/core';

export default function projectIsManagedByRepositorySettings({projectRoot}) {
  return fileExists(`${projectRoot}/.github/settings.yml`);
}

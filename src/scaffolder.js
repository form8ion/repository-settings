import {promises as fs} from 'node:fs';
import {info} from '@travi/cli-messages';
import {fileTypes, writeConfigFile} from '@form8ion/core';

import {scaffold as scaffoldRepository} from './repository/index.js';

export default async function scaffoldSettings({projectRoot, projectName, description, homepage, visibility, topics}) {
  info('Writing settings file', {level: 'secondary'});

  await fs.mkdir(`${projectRoot}/.github`, {recursive: true});

  return writeConfigFile({
    path: `${projectRoot}/.github`,
    name: 'settings',
    format: fileTypes.YAML,
    config: {
      _extends: '.github',
      repository: scaffoldRepository({projectName, description, homepage, visibility, topics})
    }
  });
}

import {fileTypes, writeConfigFile} from '@form8ion/core';

import {scaffold as scaffoldRepository} from './repository/index.js';

export default async function scaffoldSettings(
  {projectRoot, projectName, description, homepage, visibility, topics},
  {logger}
) {
  logger.info('Writing repository settings file', {level: 'secondary'});

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

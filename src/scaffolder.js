import {promises as fs} from 'node:fs';
import {info} from '@travi/cli-messages';
import {fileTypes, writeConfigFile} from '@form8ion/core';

export default async function scaffoldSettings({projectRoot, projectName, description, homepage, visibility, topics}) {
  info('Writing settings file', {level: 'secondary'});

  await fs.mkdir(`${projectRoot}/.github`, {recursive: true});

  return writeConfigFile({
    path: `${projectRoot}/.github`,
    name: 'settings',
    format: fileTypes.YAML,
    config: {
      _extends: '.github',
      repository: {
        name: projectName,
        description,
        homepage,
        private: 'Public' !== visibility,
        ...topics && {topics: topics.join(', ')}
      }
    }
  });
}

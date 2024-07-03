import {promises as fs} from 'node:fs';
import {dump} from 'js-yaml';
import {info} from '@travi/cli-messages';

export default async function scaffoldSettings({projectRoot, projectName, description, homepage, visibility, topics}) {
  info('Writing settings file', {level: 'secondary'});

  await fs.mkdir(`${projectRoot}/.github`, {recursive: true});

  return fs.writeFile(
    `${projectRoot}/.github/settings.yml`,
    dump({
      _extends: '.github',
      repository: {
        name: projectName,
        description,
        homepage,
        private: 'Public' !== visibility,
        ...topics && {topics: topics.join(', ')}
      }
    })
  );
}

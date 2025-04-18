import {fileTypes, loadConfigFile, writeConfigFile} from '@form8ion/core';

import {lift as liftRepository} from './repository/index.js';
import {lift as liftBranchProtection} from './branches/index.js';
import {lift as liftRulesets} from './rulesets/index.js';

export default async function liftRepositorySettings({projectRoot, results: {homepage, tags}, vcs}, {logger, prompt}) {
  logger.info('Lifting repository settings', {level: 'secondary'});

  const existingConfig = await loadConfigFile({
    format: fileTypes.YAML,
    path: `${projectRoot}/.github`,
    name: 'settings'
  });

  await writeConfigFile({
    format: fileTypes.YAML,
    path: `${projectRoot}/.github`,
    name: 'settings',
    config: {
      ...existingConfig,
      repository: liftRepository({homepage, tags, existingRepositoryDetails: existingConfig.repository}),
      branches: liftBranchProtection(),
      rulesets: await liftRulesets({existingRulesets: existingConfig.rulesets, vcs}, {prompt})
    }
  });

  return {};
}

import {fileTypes, mergeIntoExistingConfigFile} from '@form8ion/core';

import {lift as liftRepository} from './repository/index.js';
import {lift as liftBranchProtection} from './branches/index.js';
import {lift as liftRulesets} from './rulesets/index.js';

export default async function ({projectRoot, results: {homepage, tags}}) {
  await mergeIntoExistingConfigFile({
    format: fileTypes.YAML,
    path: `${projectRoot}/.github`,
    name: 'settings',
    config: {
      repository: liftRepository({homepage, tags}),
      branches: liftBranchProtection(),
      rulesets: liftRulesets()
    }
  });

  return {};
}

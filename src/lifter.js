import {fileTypes, mergeIntoExistingConfigFile} from '@form8ion/core';

export default async function ({projectRoot, results: {homepage, tags}}) {
  await mergeIntoExistingConfigFile({
    format: fileTypes.YAML,
    path: `${projectRoot}/.github`,
    name: 'settings',
    config: {
      repository: {
        ...homepage && {homepage},
        ...tags && {topics: tags.join(', ')}
      }
    }
  });

  return {};
}

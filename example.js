// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffold, test as projectManagedByRepositorySettings, lift} from './lib/index.mjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

// remark-usage-ignore-next
/* eslint-disable no-console */
(async () => {
  const projectRoot = process.cwd();
  const logger = {
    info: message => console.error(message),
    success: message => console.error(message),
    warn: message => console.error(message),
    error: message => console.error(message)
  };

  await scaffold(
    {
      projectRoot,
      projectName: 'project-name',
      description: 'description of the project',
      homepage: 'https://npm.im/project-name',
      visibility: 'Public',
      topics: ['topic 1', 'topic 2']
    },
    {logger}
  );

  if (await projectManagedByRepositorySettings({projectRoot})) {
    await lift(
      {
        projectRoot,
        results: {
          homepage: 'https://npm.im/project-name',
          tags: ['tag1', 'tag2']
        }
      },
      {logger}
    );
  }
})();

// remark-usage-ignore-next
/* eslint-enable no-console */

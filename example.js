// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffold} from './lib/index.mjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

(async () => {
  await scaffold({
    projectRoot: process.cwd(),
    projectName: 'project-name',
    description: 'description of the project',
    homepage: 'https://npm.im/project-name',
    visibility: 'Public',
    topics: ['topic 1', 'topic 2']
  });
})();

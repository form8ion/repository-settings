import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';

let scaffold, test, lift;
const __dirname = dirname(fileURLToPath(import.meta.url));          // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(async function () {
  this.projectRoot = process.cwd();
  this.projectName = any.word();
  this.projectDescription = any.sentence();
  this.projectHomepage = any.url();
  this.projectVisibility = any.fromList(['Public', 'Private']);
  this.topics = any.listOf(any.word);

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({scaffold, test, lift} = await import('@form8ion/repository-settings'));

  stubbedFs({
    node_modules: stubbedNodeModules
  });
});

After(function () {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  await scaffold({
    projectRoot: this.projectRoot,
    projectName: this.projectName,
    description: this.projectDescription,
    homepage: this.projectHomepage,
    visibility: this.projectVisibility,
    topics: this.topics
  });
});

When('scaffolder results are processed', async function () {
  if (await test({projectRoot: this.projectRoot})) {
    await lift({
      projectRoot: this.projectRoot,
      results: {
        homepage: this.homepage,
        tags: this.tags
      }
    });
  }
});

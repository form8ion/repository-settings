// #### Import
// remark-usage-ignore-next 3
import stubbedFs from 'mock-fs';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {Octokit} from '@octokit/core';
import any from '@travi/any';
import {scaffold, test as projectManagedByRepositorySettings, lift, promptConstants} from './lib/index.mjs';

// remark-usage-ignore-next 9
stubbedFs({'.github': {}});
const server = setupServer();
server.use(
  http.get('https://api.github.com/user', () => HttpResponse.json({login: any.word()})),
  http.get('https://api.github.com/orgs/account-name/teams', () => HttpResponse.json([
    {slug: 'maintainers', name: 'maintainers', id: any.integer()}
  ]))
);
server.listen();

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
        vcs: {owner: 'account-name', name: 'repository-name'},
        results: {
          homepage: 'https://npm.im/project-name',
          tags: ['tag1', 'tag2']
        }
      },
      {
        logger,
        octokit: new Octokit(),
        prompt: async ({id, questions}) => {
          const {questionNames, ids} = promptConstants;
          const expectedPromptId = ids.REQUIRED_CHECK_BYPASS;

          if (expectedPromptId === id) {
            const checkBypassTeamQuestionName = questionNames[expectedPromptId].CHECK_BYPASS_TEAM;

            return {
              [checkBypassTeamQuestionName]: questions
                .find(({name}) => name === checkBypassTeamQuestionName)
                .choices
                .find(({short}) => 'maintainers' === short).value
            };
          }

          throw new Error(`Unknown prompt with ID: ${id}`);
        }
      }
    );
  }
})();

// remark-usage-ignore-next
/* eslint-enable no-console */

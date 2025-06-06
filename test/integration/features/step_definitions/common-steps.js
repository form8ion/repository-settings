import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';

// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {lift, promptConstants, scaffold, test} from '@form8ion/repository-settings';
import {questionNames} from '../../../../src/prompt/constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));          // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));
const logger = {
  info: () => undefined,
  success: () => undefined,
  warn: () => undefined,
  error: () => undefined
};

Before(async function () {
  this.projectRoot = process.cwd();
  this.projectName = any.word();
  this.projectDescription = any.sentence();
  this.projectHomepage = any.url();
  this.projectVisibility = any.fromList(['Public', 'Private']);
  this.topics = any.listOf(any.word);
  this.existingRulesets = [];
  this.repositoryOwner = any.word();
  this.userAccount = any.word();

  stubbedFs({
    '.github': {},
    node_modules: stubbedNodeModules
  });
});

After(function () {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  await scaffold(
    {
      projectRoot: this.projectRoot,
      projectName: this.projectName,
      description: this.projectDescription,
      homepage: this.projectHomepage,
      visibility: this.projectVisibility,
      topics: this.topics
    },
    {logger}
  );
});

When('scaffolder results are processed', async function () {
  if (await test({projectRoot: this.projectRoot})) {
    await lift(
      {
        projectRoot: this.projectRoot,
        vcs: {owner: this.repositoryOwner},
        results: {
          homepage: this.homepage,
          tags: this.tags
        }
      },
      {
        logger,
        octokit: this.octokit,
        prompt: ({id, questions}) => {
          let chosenTeamId;
          const {
            [promptConstants.questionNames[id].CHECK_BYPASS_TEAM]: checkBypassTeamQuestionName,
            [promptConstants.questionNames[id].ADMIN_BYPASS]: adminBypassQuestionName
          } = questionNames[id];

          const checkBypassTeamQuestion = questions.find(({name}) => name === checkBypassTeamQuestionName);
          const adminBypassQuestion = questions.find(({name}) => name === adminBypassQuestionName);

          if (checkBypassTeamQuestion) {
            const {choices: checkBypassTeamChoices} = checkBypassTeamQuestion;
            ({value: chosenTeamId} = checkBypassTeamChoices.find(team => team.name === this.maintenanceTeamName));

            return {[checkBypassTeamQuestionName]: chosenTeamId};
          }

          if (adminBypassQuestion) {
            return {[adminBypassQuestionName]: true};
          }

          throw new Error('Expected a question to be asked for the required check bypass');
        }
      }
    );
  }
});

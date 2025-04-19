# repository-settings

form8ion plugin for managing configuration for the
[repository-settings app](https://github.com/apps/settings) for a project

<!--status-badges start -->

[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
[![Codecov][coverage-badge]][coverage-link]
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

## Table of Contents

* [Usage](#usage)
  * [Installation](#installation)
  * [Example](#example)
    * [Import](#import)
    * [Execute](#execute)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Verification](#verification)

## Usage

<!--consumer-badges start -->

[![MIT license][license-badge]][license-link]
[![npm][npm-badge]][npm-link]
[![Try @form8ion/repository-settings on RunKit][runkit-badge]][runkit-link]
![node][node-badge]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/repository-settings --save-prod
```

### Example

#### Import

```javascript
import {Octokit} from '@octokit/core';
import any from '@travi/any';
import {scaffold, test as projectManagedByRepositorySettings, lift, promptConstants} from '@form8ion/repository-settings';
```

#### Execute

```javascript
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
        prompt: async ({id}) => {
          const {questionNames, ids} = promptConstants;
          const expectedPromptId = ids.REQUIRED_CHECK_BYPASS;

          if (expectedPromptId === id) {
            return {[questionNames[expectedPromptId].CHECK_BYPASS_TEAM]: any.word()};
          }

          throw new Error(`Unknown prompt with ID: ${id}`);
        }
      }
    );
  }
})();
```

## Contributing

<!--contribution-badges start -->

[![PRs Welcome][PRs-badge]][PRs-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![semantic-release: angular][semantic-release-badge]][semantic-release-link]
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[github-actions-ci-link]: https://github.com/form8ion/repository-settings/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/form8ion/repository-settings/node-ci.yml.svg?branch=master&logo=github

[coverage-link]: https://codecov.io/github/form8ion/repository-settings

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/repository-settings?logo=codecov

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/repository-settings.svg?logo=opensourceinitiative

[npm-link]: https://www.npmjs.com/package/@form8ion/repository-settings

[npm-badge]: https://img.shields.io/npm/v/@form8ion/repository-settings?logo=npm

[runkit-link]: https://npm.runkit.com/@form8ion/repository-settings

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/repository-settings.svg

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg

[node-badge]: https://img.shields.io/node/v/@form8ion/repository-settings?logo=node.js

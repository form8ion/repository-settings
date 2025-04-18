import {After, AfterAll, BeforeAll, Given} from '@cucumber/cucumber';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import any from '@travi/any';

const server = setupServer();
const githubToken = any.word();

server.events.on('request:start', ({request}) => {
  // eslint-disable-next-line no-console
  console.log('Outgoing:', request.method, request.url);
});

function authorizationHeaderIncludesToken(request) {
  return request.headers.get('authorization') === `token ${githubToken}`;
}

BeforeAll(async () => {
  server.listen();
});

After(function () {
  server.resetHandlers();
});

AfterAll(() => {
  server.close();
});

Given('a maintainers team exists', async function () {
  this.maintenanceTeamId = any.integer();

  server.use(
    http.get(
      `https://api.github.com/orgs/${this.repositoryOwner}/teams`,
      ({request}) => {
        if (authorizationHeaderIncludesToken(request)) {
          return HttpResponse.json([{
            id: this.maintenanceTeamId,
            name: any.word(),
            slug: any.word()
          }]);
        }

        return undefined;
      }
    )
  );
});
